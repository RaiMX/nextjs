import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {EditorState, Modifier} from 'draft-js';

class Placeholders extends Component {
    static propTypes = {
        onChange: PropTypes.func,
        editorState: PropTypes.object,
    }

    state = {
        open: false
    }
    placeholderOptions = [
        {key: "firstName", value: "{{firstName}}", text: "First Name"},
        {key: "lastName", value: "{{lastName}}", text: "Last name"},
        {key: "company", value: "{{company}}", text: "Company"},
        {key: "address", value: "{{address}}", text: "Address"},
        {key: "zip", value: "{{zip}}", text: "Zip"},
        {key: "city", value: "{{city}}", text: "City"}
    ]

    openPlaceholderDropdown = () => this.setState({open: !this.state.open})

    addPlaceholder = (placeholder) => {
        const {editorState, onChange} = this.props;
        const contentState = Modifier.replaceText(
            editorState.getCurrentContent(),
            editorState.getSelection(),
            placeholder,
            editorState.getCurrentInlineStyle(),
        );
        onChange(EditorState.push(editorState, contentState, 'insert-characters'));
    }

    listItem = this.placeholderOptions.map(item => (
        <li
            onClick={this.addPlaceholder.bind(this, item.value)}
            key={item.key}
            className="rdw-dropdownoption-default placeholder-li"
        >{item.text}</li>
    ))

    render() {
        return (
            <div onClick={this.openPlaceholderDropdown} className="rdw-block-wrapper" aria-label="rdw-block-control">
                <div className="rdw-dropdown-wrapper rdw-block-dropdown" aria-label="rdw-dropdown">
                    <div className="rdw-dropdown-selectedtext" title="Placeholders">
                        <span>Placeholder</span>
                        <div className={`rdw-dropdown-caretto${this.state.open ? "close" : "open"}`}></div>
                    </div>
                    <ul className={`rdw-dropdown-optionwrapper ${this.state.open ? "" : "placeholder-ul"}`}>
                        {this.listItem}
                    </ul>
                </div>
            </div>
        );
    }
}

export default Placeholders;