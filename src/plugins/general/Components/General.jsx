import React from 'react';
import Breadcrumb from './Breadcrumb';
import ItemList from './ItemList';

export default function() {
  const [state, dispatch] = window.useStore();

  return (
      <div className="row">
        <div className="col-md-12">
          toolbar 1
        </div>
        <div className="col-md-12">
          toolbar 2
        </div>
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
