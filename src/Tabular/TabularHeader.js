import { useState } from 'react';
import './tabular.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import fontawesome from '@fortawesome/fontawesome'
import { faCheckSquare, faCoffee, faArrowUp, faArrowDown, faWindowClose } from '@fortawesome/fontawesome-free-solid'

fontawesome.library.add(faCheckSquare, faCoffee, faArrowUp, faArrowDown, faWindowClose);


function TabularHeader(props) {
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const handleSetDropdownOpen = () => dropdownOpen ? setDropdownOpen(false) : setDropdownOpen(true)
    return (
        <div className="tab-header-container">
            <h1 className='header-title'>{props.headerTitle || 'Tabular List'}</h1>
            {props.columns && props.columns.length ? (<div className='hidden-cols' onClick={handleSetDropdownOpen}>
                <div style={{ display: 'flex', flexDirection: 'row', margin: 'auto', alignItems: 'center', width: '5em',whiteSpace: 'nowrap' }}>
                    Hidden Columns
                    {dropdownOpen ? <FontAwesomeIcon style={{ fontSize: '10px' }} icon="fa-solid fa-arrow-up" /> :
                        <FontAwesomeIcon style={{ fontSize: '10px' }} icon="fa-solid fa-arrow-down" />}
                </div>
                {dropdownOpen ?
                    (<ul>
                        {props.columns.map(col => <li key={Math.random()} onClick={() => props.handleSetHiddenCols(col)}>{col}</li>)}
                    </ul>) : null}
            </div>) : null}
        </div>
    );
}

export default TabularHeader;
