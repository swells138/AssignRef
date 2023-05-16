import React from "react";
import conferencesService from "services/conferenceService";
import debug from "sabio-debug";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsersRectangle,
  faTv,
  faFileContract,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import Crew from "./Crew";
import TrainingVideos from "./TrainingVideos";
import Announcement from "./Announcement";
import PropTypes from "prop-types";

const _logger = debug.extend("Dash");

function AssignerDashboard(props) {
  const [dashboard, setDashboard] = useState({
    officials: 0,
    reports: 0,
    teams: 0,
    games: 0,
    announcements: [],
    crews: [],
    trainingVideos: [],
    code: "",
    logo: "",
    conference: 1,
  });

  useEffect(() => {
    conferencesService
      .getByIdDetail(props.currentUser.conferenceId)
      .then(onGetConferenceSuccess)
      .catch(onGetConferenceError);
  }, [props.currentUser.conferenceId]);

  const onGetConferenceSuccess = (response) => {
    _logger("response", response);
    let crews = response.item.crews;
    let trainingVideos = response.item.trainingVideos;
    let announcements = response.item.announcements;
    setDashboard((prev) => {
      let dd = { ...prev };
      dd.announcements = response.item.announcements;
      dd.trainingVideosArray = trainingVideos?.map(mapVideos);
      dd.crewsArray = crews?.map(mapCrew);
      dd.announcementArray = announcements?.map(mapAnnouncement);
      dd.officials = response.item.officials;
      dd.reports = response.item.reports;
      dd.teams = response.item.teams;
      dd.games = response.item.games;
      dd.name = response.item.name;
      return dd;
    });
  };

  const onGetConferenceError = (error) => {
    _logger("error", error);
  };

  const mapCrew = (obj) => {
    return <Crew crew={obj} key={obj.id}></Crew>;
  };

  const mapVideos = (obj) => {
    return <TrainingVideos video={obj} key={obj.id}></TrainingVideos>;
  };

  const mapAnnouncement = (obj) => {
    return <Announcement announcement={obj} key={obj.id}></Announcement>;
  };

  return (
    <React.Fragment>
      <div className="col-lg-12 col-md-12 col-12">
        <div className="border-bottom pb-3 mb-3 d-lg-flex justify-content-between align-items-center">
          <div className="row mb-3 mb-lg-0 align-items-center">
            <div className="col">
              <h1 className="ms-1 mb-0  fw-bold">Assigner Dashboard</h1>
              <div className="col">
                <h3 className="ms-3">{dashboard.name}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-xl-3 col-lg-6 col-md-12 col-sm-12">
          <div className="mb-4 card border-light">
            <div className="card-body">
              <a href="/games" className="fs-6 text-uppercase fw-semi-bold">
                Games
              </a>
              <div className="mt-2 d-flex justify-content-between align-items-center">
                <div className="lh-1">
                  <h2 className="h1 fw-bold mb-1">{dashboard.games}</h2>
                </div>
                <div>
                  <span className="bg-light-primary icon-shape icon-xl rounded-3 text-dark-primary">
                    <div>
                      <FontAwesomeIcon icon={faTv} size="2xl" />
                    </div>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-lg-6 col-md-12 col-sm-12">
          <div className="mb-4 card border-light">
            <div className="card-body">
              <a href="/teams" className="fs-6 text-uppercase fw-semi-bold">
                {" "}
                Teams
              </a>
              <div className="mt-2 d-flex justify-content-between align-items-center">
                <div className="lh-1">
                  <h2 className="h1 fw-bold mb-1">{dashboard.teams}</h2>
                </div>
                <div>
                  <span className="bg-light-warning icon-shape icon-xl rounded-3 text-dark-warning">
                    <div>
                      <FontAwesomeIcon icon={faUsersRectangle} size="2xl" />
                    </div>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-lg-6 col-md-12 col-sm-12">
          <div className="mb-4 card border-light">
            <div className="card-body">
              <a
                href="/foulreport"
                className="fs-6 text-uppercase fw-semi-bold"
              >
                Reports
              </a>
              <div className="mt-2 d-flex justify-content-between align-items-center">
                <div className="lh-1">
                  <h2 className="h1 fw-bold mb-1">{dashboard.reports}</h2>
                </div>
                <div>
                  <span className="bg-light-success icon-shape icon-xl rounded-3 text-dark-success">
                    <div>
                      <FontAwesomeIcon icon={faFileContract} size="2xl" />
                    </div>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-lg-6 col-md-12 col-sm-12">
          <div className="mb-4 card border-light">
            <div className="card-body">
              <a href="/officials" className="fs-6 text-uppercase fw-semi-bold">
                Officials
              </a>
              <div className="mt-2 d-flex justify-content-between align-items-center">
                <div className="lh-1">
                  <h2 className="h1 fw-bold mb-1">{dashboard.officials}</h2>
                </div>
                <div>
                  <span className="bg-light-info icon-shape icon-xl rounded-3 text-dark-info">
                    <div>
                      <FontAwesomeIcon icon={faUsers} size="2xl" />
                    </div>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-xl-4 col-lg-12 col-md-12 col-12 mb-4">
          <div className="card h-100">
            <div
              className="card-header d-flex align-items-center
                              justify-content-between card-header-height"
            >
              <h4 className="mb-0">Crews</h4>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                {dashboard.crewsArray}
              </ul>
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-lg-12 col-md-12 col-12 mb-4">
          <div className="card h-100">
            <div
              className="card-header d-flex align-items-center
                              justify-content-between card-header-height"
            >
              <h4 className="mb-0">Training Videos</h4>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                {dashboard.trainingVideosArray}
              </ul>
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-lg-12 col-md-12 col-12 mb-4">
          <div className="card h-100">
            <div className="card-header card-header-height d-flex align-items-center">
              <h4 className="mb-0">Announcements</h4>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush list-timeline-activity">
                {dashboard.announcementArray}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

AssignerDashboard.propTypes = {
  currentUser: PropTypes.shape({
    conferenceId: PropTypes.number.isRequired,
  }).isRequired,
};

export default AssignerDashboard;
