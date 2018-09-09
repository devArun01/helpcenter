import * as React from 'react'
import { NavBar } from './NavBar'
import { RichTextEditor, SerializedHtml } from './Editor'

class App extends React.Component {
  state={
    serializedHtml:""
  }

  updateSerializedHtml = newHtml =>{
    this.setState({serializedHtml: newHtml})
  }
  
  render() {
    return (
      <div className="App">
          <NavBar />  
          <RichTextEditor updateSerializedHtml={this.updateSerializedHtml}/>
          <SerializedHtml data={this.state.serializedHtml}/>      
      </div>
    )
  }
}

export default App
