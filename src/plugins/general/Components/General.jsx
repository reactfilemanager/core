import React from 'react';
import Breadcrumb from './Breadcrumb';
import ItemList from './ItemList';
import Toolbar from './Toolbar';
import {getConfig, getDefaultConfig} from '../config';

export default function() {
  const [state, dispatch] = window.useStore();
  const defaultConfig = getDefaultConfig();
  const config = getConfig();

  return (
      <div className="row">
        <div className="col-md-12">
          <Toolbar state={state.general}
                   dispatch={dispatch}
                   children={defaultConfig.toolbar}/>
        </div>
        {config.toolbar ?
            <div className="col-md-12">
              <Toolbar state={state.general}
                       dispatch={dispatch}
                       children={config.toolbar}/>
            </div>
            : null}
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-2">
              <p>Directory Tree</p>
            </div>
            <div className="col-md-10">
              <div className="row">
                <div className="col-md-12">
                  <Breadcrumb path={state.general.path} dispatch={dispatch}/>
                </div>
                <div className="col-md-12">
                  <ItemList state={state.general} dispatch={dispatch}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
