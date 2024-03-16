import './tabular.css';
import data from './fake-data.json'
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import fontawesome from '@fortawesome/fontawesome'
import { faCheckSquare, faCoffee, faArrowUp, faArrowDown } from '@fortawesome/fontawesome-free-solid'
import {
    // alphaSort, numSort, onDragStart, onDragOver, onDrop,
    arrayMove
} from './utils';

fontawesome.library.add(faCheckSquare, faCoffee, faArrowUp, faArrowDown);

function Tabular() {
    const [activeSort, setActiveSort] = useState(null)
    const [colWidths, setColWidths] = useState({})
    const [tableData, setTableData] = useState(data)
    const [draggedElement, setDraggedElement] = useState(null)

    console.log('data...', data)
    const headers = [...new Set(data.map(i => Object.keys(i)).flat())]
    // console.log('headers', headers)
    useEffect(() => {
        if (activeSort && activeSort.length) {
            let newD = []
            if (activeSort[1] === 'down') {
                newD = data.sort((a, b) => {
                    return a[activeSort[0]] - b[activeSort[0]] || a[activeSort[0]]?.toString().localeCompare(b[activeSort[0]].toString())
                });
            } else {
                newD = data.sort((a, b) => {
                    console.log(a, activeSort[0], b[activeSort[0]])
                    return b[activeSort[0]] - a[activeSort[0]] || b[activeSort[0]]?.toString().localeCompare(a[activeSort[0]].toString())
                });
            }
            console.log(newD)
            setTableData(newD)
        }
        // setTableData(data)
    }, [activeSort, tableData, draggedElement]);

    const handleResize = (e, val) => {
        e.persist();
        console.log('resizing', e, val)
    }
    const handleResizeDrop = (e, val) => {
        e.stopPropagation();
        e.preventDefault();
        console.log('resizing', e, val)
    }

    const handleOnDrag = (e, val) => {
        e.persist();
        // console.log('dragging...', e, val, e.target)
        setDraggedElement(e.target._id)
    }
    const handleOnDragOver = (e, val) => {
        e.stopPropagation();
        e.preventDefault();
    }
    const handleOnDrop = (e, val) => {
        console.log('dropping...', e, val, e.target.parentNode)
        const dragged = (element) => element._id === draggedElement;
        const dropped = (element) => element._id === val._id;
        const draggedEl = tableData.findIndex(dragged)
        const droppedLoc = tableData.findIndex(dropped)
        const updatedAfterDrop = arrayMove(tableData, draggedEl, droppedLoc)
        setTableData(updatedAfterDrop)
        setDraggedElement(null)
    }
    const handleSetActiveSort = (val, direction) => setActiveSort([val, direction])
    console.log('tableData', tableData)
    console.log('active  sort is...', activeSort, tableData[0].index, tableData[1].index)
    return (
        <div className="tabular-main">
            <table className='tabular-table'>
                <thead className='tabular-header'>
                    <tr className='tabular-row-header'>
                        {headers.map(val => (<th className='tabular-th' width={200}>
                            <div style={{ display: 'flex', flexDirection: 'row' }}>{val}
                                <div className='sorting-icons'>
                                    <FontAwesomeIcon style={{ fontSize: '10px' }} icon="fa-solid fa-arrow-up" onClick={() => handleSetActiveSort(val, 'up')} />
                                    <FontAwesomeIcon style={{ fontSize: '10px' }} icon="fa-solid fa-arrow-down" onClick={() => handleSetActiveSort(val, 'down')} />
                                </div>
                                <div className='col-resize' 
                                draggable 
                                onDragStart={(a) => handleResize(a, val)} 
                                onDragOver={(a) => handleOnDrag(a, val)}
                                onDrop={(a) => handleResizeDrop(a, val)} />
                            </div>
                        </th>))}
                    </tr>
                </thead>
                <tbody className='tabular-body'>
                    {tableData.map(row =>
                        <tr key={Math.random()}
                            draggable
                            className='tabular-row'
                            onDragStart={(e) => handleOnDrag(e, row)}
                            onDragOver={(e) => handleOnDragOver(e, row)}
                            onDrop={(e) => handleOnDrop(e, row)}>
                            {Object.keys(row).map(d => <td key={Math.random()} className='tabular-cell'>
                                {typeof row[d] === 'object' ? Object.keys(row[d]).map(p => row[d][p].name || row[d][p]).join(', ') : row[d].toString()}
                            </td>)}
                        </tr>)}
                </tbody>
            </table>
        </div>
    );
}

export default Tabular;
