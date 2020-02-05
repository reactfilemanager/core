import React from 'react';
import {bootPlugins, getTabs} from '../../pluggable';
import {useStore} from '../../state/store';
import {ToastContainer, Flip} from 'react-toastify';

export default () => {

  const [state, dispatch] = useStore();
  bootPlugins(state, dispatch);

  const tabs = getTabs();
  let navs = [];
  let contents = [];
  let activeFirst = false;
  for (const tab of tabs) {
    navs.push(
        <li className="nav-item"
            key={tab.key}
        >
          <a
              className="nav-link"
              id={tab.key + '-tab'}
              data-toggle="tab"
              href={'#' + tab.key}
              role="tab"
              aria-controls={tab.key}
              aria-selected="true"
          >
            {tab.title}
          </a>
        </li>,
    );
    contents.push(
        <div className="tab-pane fade"
             key={tab.key}
             id={tab.key}
             role="tabpanel"
             aria-selected={activeFirst ? 'false' : 'true'}
             aria-labelledby={tab.key + '-tab'}
        >
          <tab.component/>
        </div>,
    );
    // if (!activeFirst) {
    //   setTimeout(() => $('#' + tab.key + '-tab').tab('show'), 100);
    //   activeFirst = true;
    // }
  }

  return (
      <div className="row file-manager">
        <div className="col-md-12">
          <ul className="nav nav-tabs" id="myTab" role="tablist">
            {navs}
          </ul>
          <div className="tab-content" id="myTabContent">
            {contents}
          </div>
        </div>
        <ToastContainer
            position="top-right"
            autoClose={2500}
            hideProgressBar
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnVisibilityChange
            draggable
            pauseOnHover
            transition={Flip}
        />
      </div>
  );
}
