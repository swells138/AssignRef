import React, { useState } from "react";
import { Card, Row, Table, Form } from "react-bootstrap";
import { CardBody, Col } from "reactstrap";
import { getFiles, search } from "services/fileService";
import { useEffect } from "react";
import File from "./File";
import "rc-pagination/assets/index.css";
import Pagination from "rc-pagination";
import locale from "rc-pagination";
import { Formik } from "formik";
import Swal from "sweetalert2";
import debug from "sabio-debug";

const _logger = debug.extend("Dash");

function FileManager() {
  const [files, setFiles] = useState({
    size: 8,
    currentPage: 1,
    deletedFile: false,
    search: "",
    arrayOfFiles: [],
    fileComponents: [],
    total: 0,
  });

  useEffect(() => {
    if (!files.search || files.search === "") {
      getFiles(files.currentPage - 1, files.size, files.deletedFile)
        .then(onGetFilesSuccess)
        .catch(onGetFileError);
    } else {
      search(files.currentPage - 1, files.size, files.deletedFile, files.search)
        .then(onGetSearchedFilesSuccess)
        .catch(onSearchFileError);
    }
  }, [files.currentPage, files.deletedFile, files.search]);

  const onGetFilesSuccess = (response) => {
    const list = response.item.pagedItems;
    setFiles((prevState) => {
      const fd = { ...prevState };
      fd.arrayOfFiles = list;
      fd.fileComponents = list.map(mapFiles);
      fd.total = response.item.totalCount;
      return fd;
    });
  };

  const mapFiles = (obj) => {
    return <File file={obj} key={obj.id}></File>;
  };

  const onPaginateChange = (page) => {
    setFiles((prevState) => {
      let pd = { ...prevState };
      pd.currentPage = page;
      return pd;
    });
  };

  const onFilterDeletedClicked = () => {
    setFiles((prevState) => {
      let fd = { ...prevState };
      fd.deletedFile = !fd.deletedFile;
      fd.currentPage = 1;
      return fd;
    });
  };

  const searchInputChanged = (e) => {
    e.preventDefault();
    setFiles((prev) => ({
      ...prev,
      currentPage: 1,
      search: e.target.value,
    }));
  };

  const onGetFileError = () => {
    Swal.fire("Error generating file records");
  };

  const onGetSearchedFilesSuccess = (response) => {
    const array = response.item.pagedItems;
    setFiles((prevState) => {
      const fd = { ...prevState };
      fd.arrayOfFiles = array;
      fd.fileComponents = array.map(mapFiles);
      fd.total = response.item.totalCount;
      return fd;
    });
  };

  const onSearchFileError = (err) => {
    _logger("Search Failed no results", err);
  };

  return (
    <React.Fragment>
      <div className="row">
        <div className="mb-4 col-xxl-2 col-lg-3 col-md-12 col-12">
          <Formik enableReinitialize={true} initialValues={files}>
            <Form className="position-relative input-group">
              <input
                id="search"
                name="search"
                placeholder="Search..."
                aria-label="Search"
                type="search"
                className="form-control"
                onChange={searchInputChanged}
              />
            </Form>
          </Formik>
        </div>
      </div>
      <Row>
        <Col>
          <Card lg={12} md={12} sm={12}>
            <Col className="card-header">
              <Row>
                <Col className="d-flex justify-content-start">
                  <div className="mt-2 d-flex align-items-center ">
                    <h4>Files</h4>
                  </div>
                  <div className="ms-6 d-flex align-items-center">
                    <Form>
                      {" "}
                      <Form.Check
                        type="switch"
                        id="custom-switch"
                        onChange={onFilterDeletedClicked}
                        className="form-switch"
                      />
                    </Form>
                  </div>
                  <div className="mx-2 mt-2 d-flex align-items-center">
                    {!files.deletedFile ? (
                      <h5>Show Deleted Files</h5>
                    ) : (
                      <h5>Show Active Files</h5>
                    )}
                  </div>
                </Col>
                <Col>
                  <div className="d-flex align-items-center justify-content-center mt-2">
                    <Pagination
                      defaultPageSize={files.size}
                      total={files.total}
                      current={files.currentPage}
                      onChange={onPaginateChange}
                      locale={locale}
                    />
                  </div>
                </Col>
                <Col></Col>
              </Row>
            </Col>
            <CardBody className="p-0">
              <div className="table-responsive border-0 overflow-y-hidden">
                <Table className="text-nowrap table table-hover">
                  <thead className="table-light">
                    <tr role="row">
                      <th></th>
                      <th colSpan="1" role="columnheader">
                        File Name
                      </th>
                      <th colSpan="1" role="columnheader">
                        File Type
                      </th>
                      <th colSpan="1" role="columnheader">
                        Date Created
                      </th>
                      <th colSpan="1" role="columnheader">
                        UPLOADED BY
                      </th>
                      <th colSpan="1" role="columnheader">
                        Options
                      </th>
                    </tr>
                  </thead>
                  <tbody role="rowgroup">{files.fileComponents}</tbody>
                </Table>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
}

export default FileManager;
