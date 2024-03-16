import './tabular.css';
import data from './fake-data.json'
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import fontawesome from '@fortawesome/fontawesome'
import { faCheckSquare, faCoffee, faArrowUp, faArrowDown } from '@fortawesome/fontawesome-free-solid'
// import { alphaSort, numSort } from './utils';

fontawesome.library.add(faCheckSquare, faCoffee, faArrowUp, faArrowDown);

function Tabular() {
    const [activeSort, setActiveSort] = useState(null)
    console.log('data...', data)
    const headers = [...new Set(data.map(i => Object.keys(i)).flat())]
    console.log('headers', headers)
    const processedData = () => {
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
            // console.log(numSort(activeSort[1], data[activeSort[0]], data))
            return newD
        }
        return data
    }
    const handleSetActiveSort = (val, direction) => setActiveSort([val, direction])
    console.log('active  sort is...', activeSort, processedData()[0].index, processedData()[1].index)
    return (
        <div className="tabular-main">
            <table className='tabular-table'>
                <thead className='tabular-header'>
                    <tr className='tabular-row'>
                        {headers.map(val => (<th>{val}
                            <FontAwesomeIcon icon="fa-solid fa-arrow-up" onClick={() => handleSetActiveSort(val, 'up')} />
                            <FontAwesomeIcon icon="fa-solid fa-arrow-down" onClick={() => handleSetActiveSort(val, 'down')} />
                        </th>))}
                    </tr>
                </thead>
                <tbody className='tabular-body'>
                    {processedData().map(row => <tr key={Math.random()} className='tabular-row'>
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
