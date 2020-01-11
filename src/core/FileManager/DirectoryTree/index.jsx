import React from 'react';
import {useStore} from '../../../state/store';
import TreeView from '../../../helpers/TreeView';
import Holder from '../../../helpers/Holder';

const dataSource = [
  {
    type: 'Employees',
    collapsed: false,
    people: [
      {
        name: 'Paul Gordon',
        age: 29,
        sex: 'male',
        role: 'coder',
        collapsed: false,
      },
      {
        name: 'Sarah Lee',
        age: 27,
        sex: 'female',
        role: 'ocamler',
        collapsed: false,
      },
    ],
  },
  {
    type: 'CEO',
    collapsed: false,
    people: [
      {
        name: 'Drew Anderson',
        age: 39,
        sex: 'male',
        role: 'boss',
        collapsed: false,
      },
    ],
  },
];

export default () => {
  const {state, dispatch} = useStore;

  return (
      <Holder className="border">
        {dataSource.map((node, i) => {
          const type = node.type;
          const label = <span className="node">{type}</span>;
          return (
              <TreeView key={type + '|' + i} nodeLabel={label}
                        defaultCollapsed={true}>
                {node.people.map(person => {
                  const label2 = <span className="node">{person.name}</span>;
                  return (
                      <TreeView nodeLabel={label2} key={person.name}
                                defaultCollapsed={true}>
                        <div className="info">age: {person.age}</div>
                        <div className="info">sex: {person.sex}</div>
                        <div className="info">role: {person.role}</div>
                      </TreeView>
                  );
                })}
              </TreeView>
          );
        })}
      </Holder>
  );
}
