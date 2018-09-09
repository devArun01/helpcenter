import styled  from 'styled-components'

export const NavBarDiv = styled.div`
  width: 100vw;
  color: white;
  position: absolute;
  margin: 0;
  left: 0;
  top: 0;
  height: 7vh;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, 0.1);
`
export const NavTitle = styled.h3`
  margin: 0px 2%;
  color: black;
  font-family: 'Roboto', sans-serif;
`
export const EditorArea = styled.div`
  position:absolute;
  margin-top: 7vh;
  top:0;
  left:0;
  width:50%;
  height:93vh;
  font-family: 'Roboto', sans-serif;
  overflow-y:scroll;
  background-color:white;
`
export const SerializedCodeArea = styled.div`
  position:absolute;
  margin-top: 7vh;
  top:0;
  right:0;
  width:50%;
  height:93vh;
  overflow-y:scroll;
  background-color:#eafff5;
`

