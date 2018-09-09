import * as React from 'react'
import styled from 'styled-components'

export const Button = styled.span`
  cursor: pointer;
  color: ${props =>
    props.reversed
      ? props.active ? 'white' : '#aaa'
      : props.active ? 'black' : '#ccc'};
`

export const Icons = styled(({ className, ...rest }) => {
  return <span className={`material-icons ${className}`} {...rest} />
})`
  font-size: 18px;
  vertical-align: text-bottom;
`

export const Menu = styled.div`
  & > * {
    display: inline-block;
  }
  & > * + * {
    margin-left: 15px;
  }
`

export const Toolbar = styled(Menu)`
  position: relative;
  display:flex;
  align-items:center;
  padding:10px 15px;
  border-bottom: 2px solid #eee;
  margin-bottom: 20px;
`
export const Image = styled.img`
  display: block;
  max-width: 50%;
  border-radius:5px;
  margin: 20px;
  height: auto;
  box-shadow: ${props => (props.selected ? '0 0 0 2px blue;' : 'none')};
`
export const Walkthrough = styled.div`
  display: block;
  border-radius:5px;
  background-color:rgba(0,0,0,0.1);
  margin: 2%;
  height: 250px;
  width:250px;
  box-shadow: ${props => (props.selected ? '0 0 0 2px blue;' : 'none')};
`
export const WalkthroughTitleContainer = styled.div`
  width:250px;
  height:30px;
  display:flex;
  border-top-left-radius:5px;
  border-top-right-radius:5px;
  background-color:rgba(0,0,0,0.2);
  align-items:center;
`
export const WalkthroughTitle = styled.h4`
  padding: 10px;
`
export const Asset = styled.img`
  width: 110px;
  height: 100px;
  border-radius:5px;
  margin-top:5px;
  margin-left:10px;
  object-fit:cover;
`