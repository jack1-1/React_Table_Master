import React from 'react'
import styled from 'styled-components'
import { useTable, usePagination } from 'react-table'
import axios from 'axios'

const Styles = styled.div`
  padding: 1rem;
  display: flex;
  align-items: center;
  flex-direction: column;
  table {
    border-spacing: 0;
    border: 1px solid black;
    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }
    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      :last-child {
        border-right: 0;
      }
    }
  }
  .pagination {
    padding: 0.5rem;
  }
`

function Table({
  columns,
  data,
  fetchData,
  pageCount: controlledPageCount,
  pageSize: controlledPageSize,
}) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
      manualPagination: true,
      pageCount: controlledPageCount,
      pageSize: controlledPageSize,
    },
    usePagination
  )

  React.useEffect(() => {
    fetchData({ pageIndex })
  }, [fetchData, pageIndex])



  ///////-------////////-
  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
      </div>
    </>
  )
}

function App() {
  const [data, setData] = React.useState([])
  const [pageCount, setPageCount] = React.useState(0)
  const [pageSize, setPageSize] = React.useState(6)

  const columns = [{  
    Header: 'User_id',  
    accessor: 'id'  
    },
    {  
    Header: 'User_FirstName',  
    accessor: 'first_name'  
    },
    {  
    Header: 'User_LastName',  
    accessor: 'last_name'  
    },
    {  
    Header: 'Image',  
    accessor: 'avatar'  
    }]

  const fetchData = React.useCallback(({ pageIndex }) => {
    axios.get(`https://reqres.in/api/users?page=${pageIndex+1}`)
    .then(res=>{
      console.log(res.data)
      setData(res.data.data)
      setPageCount(res.data.total_pages)
      setPageSize(res.data.per_page)
    })
    .catch(err=>{
        console.log(err)
    })
  }, [])

  return (
    <Styles>
      <Table
        columns={columns}
        data={data}
        fetchData={fetchData}
        pageCount={pageCount}
        pageSize={pageSize}
      />
    </Styles>
  )
}

export default App