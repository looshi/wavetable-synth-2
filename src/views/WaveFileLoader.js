/*
Dropdown, shows a list of files.
On select, loads the file.
*/
import React from 'react';
import {connect} from 'react-redux';
import Actions from '../data/Actions.js';

class WaveFileLoader extends React.Component {
  constructor(props) {
    super(props);
  }
  onFileSelected(e) {
    let action = Actions.waveFileLoadStarted(this.props.id, e.target.value);
    this.props.dispatch(action);
  }
  render() {
   return (
     <div>
      <select onChange={this.onFileSelected.bind(this)}>
      {
        this.props.files.map( (file) => {
          return (
            <option key={file} >{file}</option>
          );
        })
      }
      </select>
     </div>
    );
  }
}
WaveFileLoader.propTypes = {
  files: React.PropTypes.array,
  id: React.PropTypes.string
};
WaveFileLoader.defaultProps = {
  files: [],
};


function mapDispatchToProps(dispatch){
  return {
    eventHandlerName: function(args) {
      dispatch({
        type: 'EVENT_NAME',
        arg1: 'value',
        arg2: 'value'
      });
    }
  }
}

// export default connect(null, mapDispatchToProps)(WaveFileLoader);
// By default, invoking connect with no arguments will inject dispatch as
// a prop to the component.
export default connect()(WaveFileLoader);
