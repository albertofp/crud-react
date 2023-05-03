import './App.css'
import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate'
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai"
import { IconContext } from "react-icons"

export default function App() {

  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [filterData, setFilterData] = useState()
  const itemsPerPage = 3

  useEffect(() => {
    setLoading(true)
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then((response) => response.json())
      .then((json) => {
        setPosts([...json])
      })
      .finally(() => {
        setFilterData(
          posts.filter((item, index) => {
            return (index >= page * itemsPerPage) & (index < (page + 1) * itemsPerPage)
          })
        )
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    setFilterData(
      posts.filter((item, index) => {
        return (index >= page * itemsPerPage) & (index < (page + 1) * itemsPerPage)
      })
    )
  }, [page, posts])

  function deletePost(id) {
    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: 'DELETE',
    }).then(() => {
      setPosts(posts.filter((n) => n !== id))
      console.log(posts.length)
    }) // remove obj com id desejado
  }

  function editPost(id) {
    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        id: id,
        title: 'foo',
        body: 'bar',
        userId: 1,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((json) => console.log(json));
  }

  function addPost(postTitle, postBody) {
    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify({
        title: postTitle,
        body: postBody,
        userId: 1,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((json) => console.log(json));

  }

  return (
    <main>
      <button onClick={() => console.log(posts)}>log posts</button>
      <ul>
        {loading ? <h2>Loading...</h2> : filterData?.map((item, key) =>
          <li key={item.id} className='post'>
            <h4>{item.id} - {item.title} <button onClick={() => deletePost(item.id)}>DEL</button>
              <button>EDIT</button></h4>
            {item.body}

          </li>)}
      </ul>
      <ReactPaginate
        containerClassName={"pagination"}
        pageClassName={"page-item"}
        activeClassName={"active"}
        onPageChange={(event) => setPage(event.selected)}
        pageCount={Math.ceil(posts.length / itemsPerPage)}
        breakLabel="..."
        previousLabel={
          <IconContext.Provider value={{ color: "#B8C1CC", size: "36px" }}>
            <AiFillLeftCircle />
          </IconContext.Provider>
        }
        nextLabel={
          <IconContext.Provider value={{ color: "#B8C1CC", size: "36px" }}>
            <AiFillRightCircle />
          </IconContext.Provider>
        }
      />

    </main>
  )
}
