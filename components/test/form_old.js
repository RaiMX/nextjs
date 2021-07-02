import React from 'react';

import {Section} from './section';

export default function MyForm({raw_text}) {

    const section_1 = new Section(raw_text, "{{", "}}");
    section_1.process();
    console.log(section_1)

    return (
        <div>{raw_text}</div>
    )
}