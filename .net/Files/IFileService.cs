using Microsoft.AspNetCore.Http;
using Sabio.Models;
using Sabio.Models.Domain.Files;
using Sabio.Models.Requests.Files;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace Sabio.Services.Interfaces
{
    public interface IFileService
    {
        void DeleteById(int deleteId);
        Paged<File> GetAll(int pageIndex, int pageSize, bool isDeleted);
        Paged<File> GetByCreatedBy(int pageIndex, int pageSize, int id);
        BaseFile Add(FileAddRequest model, int userId);
        Paged<File> Search(int pageIndex, int pageSize, bool isDeleted, string query);
        Task<string> UploadFile(IFormFile files);
        int GetFileTypeByExt(string file);

    }
}