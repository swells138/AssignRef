import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import * as Icon from "react-bootstrap-icons";
import { format } from "date-fns";
import { deleteFile } from "services/fileService";
import Swal from "sweetalert2";
import userService from "services/userService";
import debug from "sabio-debug";
import toastr from "toastr";

const _logger = debug.extend("Dash");

function File({ file }) {
  let date = new Date(file.dateCreated);
  const [user, setUser] = useState({});

  useEffect(() => {
    userService
      .getUserById(file.createdBy)
      .then(onGetUserSuccess)
      .catch(onGetUserError);
  }, []);

  const onGetUserSuccess = (response) => {
    _logger("user response", response);
    let user = response.item;
    setUser((prevState) => {
      let ud = { ...prevState };
      ud.information = user;
      return user;
    });
  };

  const onGetUserError = () => {
    Swal.fire("User Not Found");
  };

  const renderIcon = (fileType) => {
    switch (fileType) {
      case "JPG":
        return (
          <div className="icon-shape icon-lg rounded-3 bg-light-primary">
            <Icon.FileEarmarkImage size={50} />
          </div>
        );
        break;
      case "PNG":
        return (
          <div className="icon-shape icon-lg rounded-3 bg-light-info">
            <Icon.FiletypePng size={50} />
          </div>
        );
        break;
      case "DOC":
        return (
          <div className="icon-shape icon-lg rounded-3 bg-light-secondary">
            <Icon.FiletypeDoc size={50} />
          </div>
        );
        break;
      case "PDF":
        return (
          <div className="icon-shape icon-lg rounded-3 bg-light-warning">
            <Icon.FiletypePdf size={50} />
          </div>
        );
        break;
      case "DOCX":
        return (
          <div className="icon-shape icon-lg rounded-3 bg-light-danger">
            <Icon.FiletypeDocx size={50} />
          </div>
        );
        break;
      case "XLS":
        return (
          <div className="icon-shape icon-lg rounded-3 bg-light-success">
            <Icon.FiletypeXls size={50} />
          </div>
        );
        break;
      case "TXT":
        return (
          <div className="icon-shape icon-lg rounded-3 bg-light-primary">
            <Icon.FiletypeTxt size={50} />
          </div>
        );
        break;
      case "Tiff":
        return (
          <div className="icon-shape icon-lg rounded-3 bg-light-secondary">
            <Icon.FiletypeTiff size={50} />
          </div>
        );
        break;
      case "MP4":
        return (
          <div className="icon-shape icon-lg rounded-3 bg-light-info">
            <Icon.FiletypeM4p size={50} />
          </div>
        );
        break;
      case "GIF":
        return (
          <div className="icon-shape icon-lg rounded-3 bg-light-warning">
            <Icon.FiletypeGif size={50} />
          </div>
        );
        break;
      case "ZIP":
        return (
          <div className="icon-shape icon-lg rounded-3 bg-light-success">
            <Icon.FileEarmarkZip size={50} />
          </div>
        );
        break;
      case "WAV":
        return (
          <div className="icon-shape icon-lg rounded-3 bg-light-danger">
            <Icon.FiletypeWav size={50} />
          </div>
        );
        break;
      case "MP3":
        return (
          <div className="icon-shape icon-lg rounded-3 bg-light-primary">
            <Icon.FiletypeMp3 size={50} />
          </div>
        );
        break;
      case "XML":
        return (
          <div className="icon-shape icon-lg rounded-3 bg-light-danger">
            <Icon.FiletypeXml size={50} />
          </div>
        );
        break;
      case "SVG":
        return (
          <div className="icon-shape icon-lg rounded-3 bg-light-secondary">
            <Icon.FiletypeSvg size={50} />
          </div>
        );
        break;
      case "EXE":
        return (
          <div className="icon-shape icon-lg rounded-3 bg-light-warning">
            <Icon.FiletypeExe size={50} />
          </div>
        );
        break;

      case "BMP":
        return (
          <div className="icon-shape icon-lg rounded-3 bg-light-success">
            <Icon.FiletypeBmp size={50} />
          </div>
        );
        break;
      case "HTML":
        return (
          <div className="icon-shape icon-lg rounded-3 bg-light-info">
            <Icon.FiletypeHtml size={50} />
          </div>
        );
        break;
      default:
        return <Icon.FileEarmark size={50} />;
    }
  };

  const onLocalIconClicked = () => {
    Swal.fire({
      icon: "question",
      title: "Are You Sure",
      text: file.name,
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then((response) => {
      if (response.isConfirmed) {
        deleteFile(file.id).then(onSuccessFileHandle).catch(onDeleteFileError);
      }
    });
  };

  const onSuccessFileHandle = () => {
    toastr["success"]("You Deleted a File", "Success");
  };

  const onDeleteFileError = () => {
    toastr["error"]("There was a problem deleting the file", "error");
  };

  const onLocalRestoreClicked = () => {
    Swal.fire({
      icon: "question",
      title: "Are You Sure",
      text: file.name,
      showCancelButton: true,
      confirmButtonText: "Restore",
    }).then((response) => {
      if (response.isConfirmed) {
        deleteFile(file.id)
          .then(onSuccessFileRestore)
          .catch(onRestoreFileError);
      }
    });
  };

  const onSuccessFileRestore = () => {
    toastr["success"]("You Restored a File", "Success");
  };

  const onRestoreFileError = () => {
    toastr["error"]("There was a problem restoring the file", "error");
  };

  return (
    <tr role="row">
      <td role="cell" className="align-middle">
        <div className="d-flex align-items-center">
          <div className="ms-3">
            <h5 className="mb-0">
              <img
                src={file.url}
                className="icon-shape icon-lg rounded-3"
              ></img>
              <a
                className="text-inherit"
                href="/dashboard/projects/single/files"
              ></a>
            </h5>
          </div>
        </div>
      </td>
      <td role="cell" className="align-middle">
        {file.name}
      </td>
      <td role="cell" className="align-middle">
        {renderIcon(file.fileType.name)}
      </td>
      <td role="cell" className="align-middle">
        {format(date, "MM/dd/yyyy")}
      </td>
      <td role="cell" className="align-middle">
        {user.firstName + " " + user.lastName}
      </td>
      <td role="cell" className="align-middle">
        <div className="dropdown row">
          <a href={file.url} download className="col mx-1 text-info">
            <Icon.Download size={30}></Icon.Download>
          </a>
          <div className="col text-danger">
            {file.isDeleted ? (
              <Icon.ArrowCounterclockwise
                onClick={onLocalRestoreClicked}
                size={30}
              />
            ) : (
              <Icon.Trash onClick={onLocalIconClicked} size={30} />
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}
File.propTypes = {
  file: PropTypes.shape({
    createdBy: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    isDeleted: PropTypes.bool.isRequired,
    dateCreated: PropTypes.string.isRequired,
    fileType: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
export default File;
