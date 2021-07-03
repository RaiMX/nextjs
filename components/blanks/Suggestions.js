import React from 'react';

const HASHTAGS = [
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven'
];

export default function Suggestions({autocompleteState, renderPlaceholder}) {

    if (!autocompleteState) return null;
    const {searchText} = autocompleteState;

    return (
        <div>
            <ul>
                {HASHTAGS
                    .filter(item => item.substring(0, searchText.length) === searchText)
                    .map((result, i) =>
                        <li key={i} className="suggestion" onMouseDown={() => renderPlaceholder(result)}>
                            {result}
                        </li>
                    )
                }
            </ul>
        </div>
    )
}