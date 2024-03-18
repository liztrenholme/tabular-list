import './tabular.css';
import data from './fake-data.json'
import { useState, useEffect, useCallback, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import fontawesome from '@fortawesome/fontawesome'
import { faCheckSquare, faCoffee, faArrowUp, faArrowDown, faWindowClose } from '@fortawesome/fontawesome-free-solid'
import TabularHeader from './TabularHeader';
import {
    // alphaSort, numSort, onDragStart, onDragOver, onDrop,
    arrayMove,
    createHeaders
} from './utils';

fontawesome.library.add(faCheckSquare, faCoffee, faArrowUp, faArrowDown, faWindowClose);


function Tabular(props) {
    const [activeSort, setActiveSort] = useState(null)
    const [colWidths, setColWidths] = useState({})
    const [tableData, setTableData] = useState(data)
    const [draggedElement, setDraggedElement] = useState(null)
    const [hiddenCols, setHiddenCols] = useState([])
    const [headers, setHeaders] = useState([])
    const [tableHeight, setTableHeight] = useState("auto");
    const tableElement = useRef(null);
    const [activeIndex, setActiveIndex] = useState(null);

    console.log('data...', data)
    // console.log('headers', headers)
    // const columns = createHeaders(headers);
    useEffect(() => {
        setTableHeight(tableElement.current.offsetHeight);
    }, []);

    const mouseDown = (index) => {
        setActiveIndex(index);
    };

    const mouseMove = useCallback(
        (e) => {
            const gridColumns = headers.map((col, i) => {
                if (i === activeIndex) {
                    const width = e.clientX - col.ref.current.offsetLeft;

                    if (width >= props.minCellWidth || 200) {
                        return `${width}px`;
                    }
                }
                return `${col.ref.current.offsetWidth}px`;
            });

            tableElement.current.style.gridTemplateColumns = `${gridColumns.join(
                " "
            )}`;
        },
        [activeIndex, headers, props.minCellWidth]
    );

    const removeListeners = useCallback(() => {
        window.removeEventListener("mousemove", mouseMove);
        window.removeEventListener("mouseup", removeListeners);
    }, [mouseMove]);

    const mouseUp = useCallback(() => {
        setActiveIndex(null);
        removeListeners();
    }, [setActiveIndex, removeListeners]);

    useEffect(() => {
        if (activeIndex !== null) {
            window.addEventListener("mousemove", mouseMove);
            window.addEventListener("mouseup", mouseUp);
        }

        return () => {
            removeListeners();
        };
    }, [activeIndex, mouseMove, mouseUp, removeListeners]);
    const colsRef = useRef({});
    const handleSetHeaders = useCallback(() => {
        // const columns = createHeaders(headers);

        const headersForTable = [...new Set(data.map(i => Object.keys(i)).flat())]
        const headersForTableWithoutHidden = headersForTable.filter((el) => !hiddenCols.includes(el));
        const cols = headersForTableWithoutHidden.map(j => ({val: j, ref: el => colsRef.current[j] = el}))
        setHeaders(e => cols)
    }, [hiddenCols])

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
        console.log('ughhhhhh')
        handleSetHeaders()
        // setTableData(data)
    }, [activeSort, tableData, draggedElement, handleSetHeaders]);

    // const handleResize = (e, val) => {
    //     e.persist();
    //     console.log('resizing', e, val)
    // }
    // const handleResizeDrop = (e, val) => {
    //     e.stopPropagation();
    //     e.preventDefault();
    //     console.log('resizing', e, val)
    // }

    const handleOnDrag = (e, val) => {
        e.persist();
        setDraggedElement(val._id)
    }
    const handleOnDragOver = (e, val) => {
        e.stopPropagation();
        e.preventDefault();
    }
    const handleOnDrop = (e, val) => {
        const dragged = (element) => element._id === draggedElement;
        const dropped = (element) => element._id === val._id;
        const draggedEl = tableData.findIndex(dragged)
        const droppedLoc = tableData.findIndex(dropped)
        const updatedAfterDrop = arrayMove(tableData, draggedEl, droppedLoc)
        setTableData(updatedAfterDrop)
        setDraggedElement(null)
    }
    const handleSetActiveSort = (val, direction) => setActiveSort([val, direction])
    console.log('tableData', tableData, headers)

    const handleSetHiddenCols = (col) => {
        let currentlyHidden = [...hiddenCols]
        if (currentlyHidden.find(i => i === col)) {
             currentlyHidden = currentlyHidden.filter(item => item !== col)
        } else {
            currentlyHidden.push(col)
        }
        setHiddenCols(currentlyHidden)
    }
    return (
        <div className="tabular-main">
            <TabularHeader
                columns={hiddenCols}
                handleSetHiddenCols={handleSetHiddenCols} />
            <table className='tabular-table' ref={tableElement}>
                <thead className='tabular-header'>
                    <tr className='tabular-row-header'>
                        {headers.map(({ ref, val }, i) => (<th ref={ref} className='tabular-th' width={200}>
                            <div style={{ display: 'flex', flexDirection: 'row' }}>{val}
                                <div className='sorting-icons'>
                                    <FontAwesomeIcon style={{ fontSize: '10px' }} icon="fa-solid fa-arrow-up" onClick={() => handleSetActiveSort(val, 'up')} />
                                    <FontAwesomeIcon style={{ fontSize: '10px' }} icon="fa-solid fa-arrow-down" onClick={() => handleSetActiveSort(val, 'down')} />
                                </div>
                                <div className='hide-col'>
                                    <FontAwesomeIcon style={{ fontSize: '10px' }} icon="fa-solid fa-window-close" onClick={() => handleSetHiddenCols(val)} />
                                </div>
                                <div className={`col-resize resize-handle ${activeIndex === i ? "active" : "idle"
                                    }`}
                                    style={{ height: tableHeight }}
                                    onMouseDown={() => mouseDown(i)}
                                // draggable
                                // onDragStart={(a) => handleResize(a, val)}
                                // onDragOver={(a) => handleOnDrag(a, val)}
                                // onDrop={(a) => handleResizeDrop(a, val)}
                                />
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
                            {Object.keys(row).map(d => <td key={Math.random()} className='tabular-cell' style={hiddenCols.includes(d) ? {display: 'none'} : {}}>
                                {!hiddenCols.includes(d) ? typeof row[d] === 'object' ? Object.keys(row[d]).map(p => row[d][p].name || row[d][p]).join(', ') : row[d].toString() : null}
                            </td>)}
                        </tr>)}
                </tbody>
            </table>
        </div>
    );
}

export default Tabular;
