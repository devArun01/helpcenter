import * as React from 'react'
import { Editor } from 'slate-react'
import {  Block, Value } from 'slate'
import { EditorArea, SerializedCodeArea }  from  './StyledComps'
import { Button, Icons, Toolbar, Image, Walkthrough, WalkthroughTitle, WalkthroughTitleContainer, Asset } from './slateComps'
import { Icon } from 'react-icons-kit'
import {ic_format_list_numbered} from 'react-icons-kit/md/ic_format_list_numbered'
import {ic_format_list_bulleted} from 'react-icons-kit/md/ic_format_list_bulleted'
import {image} from 'react-icons-kit/fa/image'
import Html from 'slate-html-serializer'
import {won} from 'react-icons-kit/fa/won'

const DEFAULT_NODE = 'paragraph'

const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                text: '',
              },
            ],
          },
        ],
      },
    ],
  },
})

const schema = {
  document: {
    last: { type: 'paragraph' },
    normalize: (change, { code, node, child }) => {
      switch (code) {
        case 'last_child_type_invalid': {
          const paragraph = Block.create('paragraph')
          return change.insertNodeByKey(node.key, node.nodes.size, paragraph)
        }
        default: 
        return ;
      }
    },
  },
  blocks: {
    image: {
      isVoid: true,
    },
    walkthrough: {
      isVoid: true,
    },
  },
}

const BLOCK_TAGS = {
  p: 'paragraph',
}

// Add a dictionary of mark tags.
const MARK_TAGS = {
  em: 'italic',
  strong: 'bold',
  u: 'underline',
}

const rules = [
  {
    deserialize(el, next) {
      const type = BLOCK_TAGS[el.tagName.toLowerCase()]
      if (type) {
        return {
          object: 'block',
          type: type,
          data: {
            className: el.getAttribute('class'),
          },
          nodes: next(el.childNodes),
        }
      }
    },
    serialize(obj, children) {
      if (obj.object === 'block') {
        switch (obj.type) {
          case 'paragraph':
            return <p className={obj.data.get('className')}>{children}</p>
          case 'numbered-list':
                  return <ol>{children}</ol>;
          case 'bulleted-list':
              return <ul>{children}</ul>;
          case 'list-item':
              return <li>{children}</li>;
          case 'image': 
            return <img src={obj.data.get('src')} alt={obj.data.get('src')}/>
          case 'walkthrough': 
            return <walkthrough assets={obj.data.get('src')}/>
          default:
            return;
        }
      }
    },
  },
  // Add a new rule that handles marks...
  {
    deserialize(el, next) {
      const type = MARK_TAGS[el.tagName.toLowerCase()]
      if (type) {
        return {
          object: 'mark',
          type: type,
          nodes: next(el.childNodes),
        }
      }
    },
    serialize(obj, children) {
      if (obj.object === 'mark') {
        switch (obj.type) {
          case 'bold':
            return <strong>{children}</strong>
          case 'italic':
            return <em>{children}</em>
          case 'underlined':
            return <u>{children}</u>
          default:
            return;
        }
      }
    },
  },
]

const html = new Html({ rules })

// Define our app...
export class RichTextEditor extends React.Component {


  state = {
    value: initialValue,
  }

  hasMark = type => {
    const { value } = this.state
    return value.activeMarks.some(mark => mark.type === type)
  }


  hasBlock = type => {
    const { value } = this.state
    return value.blocks.some(node => node.type === type)
  }

  insertImage = (change, src, target) => {
    if (target) {
      change.select(target)
    }
  
    change.insertBlock({
      type: 'image',
      data: { src },
    })
  }

  insertWalkthrough = (change, src, target) =>{
    if (target) {
      change.select(target)
    }
    change.insertBlock({
      type: 'walkthrough',
      data:{src},
    })
  }

  // Render the editor.
  render() {
    return (
      <EditorArea>
        <Toolbar>
          {this.renderMarkButton('bold', 'B')}
          {this.renderMarkButton('italic', 'I')}
          {this.renderMarkButton('underlined', 'U')}
          {this.renderBlockButton('numbered-list', <Icon icon={ic_format_list_numbered} />)}
          {this.renderBlockButton('bulleted-list', <Icon icon={ic_format_list_bulleted} />)}
          <Button onClick={this.onClickImage}><Icon icon={image} /></Button>
          <Button onClick={this.onClickWalkthrough}><Icon icon={won} /></Button>
        </Toolbar>
        <Editor
          spellCheck
          autoFocus
          placeholder="Enter some rich text..."
          schema={schema}
          value={this.state.value}
          onChange={this.onChange}
          renderNode={this.renderNode}
          renderMark={this.renderMark}
        />
      </EditorArea>
    )
  }

  renderMarkButton = (type, icon) => {
    const isActive = this.hasMark(type)

    return (
      <Button
        active={isActive}
        onMouseDown={event => this.onClickMark(event, type)}
      >
        <Icons>{icon}</Icons>
      </Button>
    )
  }


  renderBlockButton = (type, icon) => {
    let isActive = this.hasBlock(type)

    if (['numbered-list', 'bulleted-list'].includes(type)) {
      const { value } = this.state
      const parent = value.document.getParent(value.blocks.first().key)
      isActive = this.hasBlock('list-item') && parent && parent.type === type
    }

    return (
      <Button
        active={isActive}
        onMouseDown={event => this.onClickBlock(event, type)}
      >
        <Icons>{icon}</Icons>
      </Button>
    )
  }

  renderNode = props => {
    const { attributes, children, node, isFocused } = props

    switch (node.type) {
      case 'bulleted-list':
        return <ul {...attributes}>{children}</ul>
      case 'list-item':
        return <li {...attributes}>{children}</li>
      case 'numbered-list':
        return <ol {...attributes}>{children}</ol>
      case 'image': {
        const src = node.data.get('src')
        return <Image src={src} selected={isFocused} {...attributes} />
      }
      case 'walkthrough':{
        const src = node.data.get('src')
        return (
          <Walkthrough selected={isFocused} {...attributes} >
            <WalkthroughTitleContainer>
              <WalkthroughTitle>Steps to do something</WalkthroughTitle>
            </WalkthroughTitleContainer>
            <Asset src={src}/>
            <Asset src={src}/>
            <Asset src={src}/>
            <Asset src={src}/>
          </Walkthrough>
        )
      }
      default: 
        return ;
    }
  }

  renderMark = props => {
    const { children, mark, attributes } = props

    switch (mark.type) {
      case 'bold':
        return <strong {...attributes}>{children}</strong>
      case 'italic':
        return <em {...attributes}>{children}</em>
      case 'underlined':
        return <u {...attributes}>{children}</u>
      default: 
        return ;
    }
  }

  onChange = ({ value }) => {
    this.setState({value})
    this.props.updateSerializedHtml(html.serialize(value))
  }

  onClickMark = (event, type) => {
    event.preventDefault()
    const { value } = this.state
    const change = value.change().toggleMark(type)
    this.onChange(change)
  }
  
  onClickBlock = (event, type) => {
    event.preventDefault()
    const { value } = this.state
    const change = value.change()
    const { document } = value

    // Handle everything but list buttons.
    if (type !== 'bulleted-list' && type !== 'numbered-list') {
      const isActive = this.hasBlock(type)
      const isList = this.hasBlock('list-item')

      if (isList) {
        change
          .setBlocks(isActive ? DEFAULT_NODE : type)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
      } else {
        change.setBlocks(isActive ? DEFAULT_NODE : type)
      }
    } else {
      // Handle the extra wrapping required for list buttons.
      const isList = this.hasBlock('list-item')
      const isType = value.blocks.some(block => {
        return !!document.getClosest(block.key, parent => parent.type === type)
      })

      if (isList && isType) {
        change
          .setBlocks(DEFAULT_NODE)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
      } else if (isList) {
        change
          .unwrapBlock(
            type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
          )
          .wrapBlock(type)
      } else {
        change.setBlocks('list-item').wrapBlock(type)
      }
    }

    this.onChange(change)
  }

  onClickImage = event => {
    event.preventDefault()
    const src = 'https://wallpaper-house.com/data/out/7/wallpaper2you_156502.jpg'
    if (!src) return

    const change = this.state.value.change().call(this.insertImage, src)

    this.onChange(change)
  }

  onClickWalkthrough = event => {
    event.preventDefault()
    const src = 'https://wallpaper-house.com/data/out/7/wallpaper2you_156502.jpg'
    if (!src) return

    const change = this.state.value.change().call(this.insertWalkthrough, src)

    this.onChange(change)
  }


}

export const SerializedHtml = props =>(
  <SerializedCodeArea>
    {props.data}
  </SerializedCodeArea>
)

