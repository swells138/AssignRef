using Amazon;
using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Transfer;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Microsoft.VisualBasic.FileIO;
using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.AppSettings;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Files;
using Sabio.Models.Enums;
using Sabio.Models.Requests.Files;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class FileService : IFileService
    {

        private IDataProvider _data = null;
        private AWSConfigCredentials _awsCred;
        public FileService(IDataProvider data, IOptions<AWSConfigCredentials> awsCred)
        {
            _data = data;
            _awsCred = awsCred.Value;
        }
        public void DeleteById(int deleteId)
        {
            string procName = "[dbo].[Files_Delete_ById]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection collection)
                {
                    collection.AddWithValue("@Id", deleteId);
                }, null);

        }

        public Paged<File> GetByCreatedBy(int pageIndex, int pageSize, int id)
        {
            Paged<File> pagedList = null;
            List<File> fileList = null;
            int totalCount = 0;

            string procName = "[dbo].[Files_Select_ByCreatedBy]";

            _data.ExecuteCmd(procName,
                inputParamMapper: delegate (SqlParameterCollection collection)
                {
                    collection.AddWithValue("@PageIndex", pageIndex);
                    collection.AddWithValue("@PageSize", pageSize);
                    collection.AddWithValue("@CreatedBy", id);
                },
            singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                File aFile = MapSingleFile(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }

                if (fileList == null)
                {
                    fileList = new List<File>();
                }
                fileList.Add(aFile);
            });

            if (fileList != null)
            {
                pagedList = new Paged<File>(fileList, pageIndex, pageSize, totalCount);

            }

            return pagedList;
        }

        public Paged<File> GetAll(int pageIndex, int pageSize, bool isDeleted)
        {
            Paged<File> pagedList = null;
            List<File> fileList = null;
            int totalCount = 0;

            string procName = "[dbo].[Files_SelectAll]";

            _data.ExecuteCmd(procName,
                inputParamMapper: delegate (SqlParameterCollection collection)
                {
                    collection.AddWithValue("@PageIndex", pageIndex);
                    collection.AddWithValue("@PageSize", pageSize);
                    collection.AddWithValue("@IsDeleted", isDeleted);
                },
            singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                File aFile = MapSingleFile(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }

                if (fileList == null)
                {
                    fileList = new List<File>();
                }
                fileList.Add(aFile);
            });

            if (fileList != null)
            {
                pagedList = new Paged<File>(fileList, pageIndex, pageSize, totalCount);
            }

            return pagedList;
        }

        public BaseFile Add(FileAddRequest model,int userId)
        {
            int id = 0;
            string procName = "[dbo].[Files_Insert]";
            BaseFile baseFile = new BaseFile();

            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection collection)
                {
                    collection.AddWithValue("@Name", model.Name);
                    collection.AddWithValue("@Url", model.Url);
                    collection.AddWithValue("@CreatedBy", userId);
                    collection.AddWithValue("@FileTypeId", (model.FileTypeId));
                    SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                    idOut.Direction = ParameterDirection.Output;
                    collection.Add(idOut);
                },
                returnParameters: delegate (SqlParameterCollection returnCollection)
                {
                    object oId = returnCollection["@Id"].Value;
                    int.TryParse(oId.ToString(), out id);
                });
            baseFile.Id = id;
            baseFile.Url = model.Url;
            return baseFile;
        }

        public Paged<File> Search(int pageIndex, int pageSize, bool isDeleted, string query)
        {
            string proc = "[dbo].[Files_Search]";
            Paged<File> pagedList = null;
            List<File> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(proc, (collection) =>
            {

                collection.AddWithValue("@PageIndex", pageIndex);
                collection.AddWithValue("@PageSize", pageSize);
                collection.AddWithValue("@IsDeleted", isDeleted);
                collection.AddWithValue("@Query", query);
            }, (reader, recordSetIndex) =>
            {
                int index = 0;
                File model = MapSingleFile(reader, ref index);
                if (totalCount == 0)
                { totalCount = reader.GetSafeInt32(index); }


                if (list == null)
                {
                    list = new List<File>();
                }
                list.Add(model);
            });
            if (list != null)
            {
                pagedList = new Paged<File>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public async Task<string> UploadFile(IFormFile files)
        {
            var accesskey = _awsCred.AccessKey;
            var secretkey = _awsCred.Secret;
            var bucketRegion = _awsCred.BucketRegion;
            var bucketName = _awsCred.BucketName;

            AmazonS3Client s3Client = new AmazonS3Client(accesskey, secretkey, RegionEndpoint.USWest2);

            var fileTransferUtility = new TransferUtility(s3Client);

            string inputString = string.Format("userfile_{0}_{1}", System.IO.Path.GetRandomFileName(), files.FileName);
            await fileTransferUtility.UploadAsync(files.OpenReadStream(), bucketName, inputString);

            return string.Format("https://{0}.s3.{1}.amazonaws.com/{2}", bucketName, bucketRegion, inputString);
        }

        public int GetFileTypeByExt(string file)
        {
            if (file == null)
            {
                return (int)FileType.Other;
            }
            string[] parts = file.Split(".");
            string ext = parts[1];
            string extUpper = ext.ToUpper();
            FileType fileType = 0;

            switch (extUpper)
            {
                case "PDF":
                    fileType = FileType.PDF;
                    break;
                case "DOC":
                    fileType = FileType.DOC;
                    break;
                case "DOCX":
                    fileType = FileType.DOCX;
                    break;
                case "xls":
                    fileType = FileType.XLS;
                    break;
                case "TXT":
                    fileType = FileType.TXT;
                    break;
                case "TIFF":
                    fileType = FileType.Tiff;
                    break;
                case "JPEG":
                    fileType = FileType.JPG;
                    break;
                case "JPG":
                    fileType = FileType.JPG;
                    break;
                case "PNG":
                    fileType = FileType.PNG;
                    break;
                case "MP4":
                    fileType = FileType.MP4;
                    break;
                case "GIF":
                    fileType = FileType.GIF;
                    break;
                case "ZIP":
                    fileType = FileType.ZIP;
                    break;
                case "WAV":
                    fileType = FileType.WAV;
                    break;
                case "WMV":
                    fileType = FileType.WMV;
                    break;
                case "MP3":
                    fileType = FileType.MP3;
                    break;
                case "XML":
                    fileType = FileType.XML;
                    break;
                case "SVG":
                    fileType = FileType.SVG;
                    break;
                case "EXE":
                    fileType = FileType.EXE;
                    break;
                case "RAR":
                    fileType = FileType.RAR;
                    break;
                case "BMP":
                    fileType = FileType.BMP;
                    break;
                case "HTML":
                    fileType = FileType.HTML;
                    break;
                case "SWF":
                    fileType = FileType.SWF;
                    break;
                default:
                    fileType = FileType.Other;
                    break;
            }
            return (int)fileType;
        }

        private File MapSingleFile(IDataReader reader, ref int startingIndex)
        {
            File aFile = new File();
            aFile.FileType = new LookUp();

            aFile.Id = reader.GetSafeInt32(startingIndex++);
            aFile.Name = reader.GetSafeString(startingIndex++);
            aFile.Url = reader.GetSafeString(startingIndex++);
            aFile.IsDeleted = reader.GetBoolean(startingIndex++);
            aFile.CreatedBy = reader.GetSafeInt32(startingIndex++);
            aFile.DateCreated = reader.GetDateTime(startingIndex++);
            aFile.FileType.Id = reader.GetSafeInt32(startingIndex++);
            aFile.FileType.Name = reader.GetSafeString(startingIndex++);
            return aFile;
        }

    }
}
