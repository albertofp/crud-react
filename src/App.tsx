import './App.css'
import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate'
import { AiFillLeftCircle, AiFillRightCircle } from 'react-icons/ai'
import { IconContext } from 'react-icons'
import Button from 'react-bootstrap/Button'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import FormComponent from './Form'

export type Post = {
	userid: number
	id: number
	title: string
	body: string
}

export default function App() {
	const [posts, setPosts] = useState<Post[]>([])
	const [page, setPage] = useState(0)
	const [loading, setLoading] = useState(false)
	const [filterData, setFilterData] = useState<Post[]>()
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
						return (
							index >= page * itemsPerPage && index < (page + 1) * itemsPerPage
						)
					})
				)
				setLoading(false)
			})
	}, [])

	useEffect(() => {
		setFilterData(
			posts.filter((item, index) => {
				return index >= page * itemsPerPage && index < (page + 1) * itemsPerPage
			})
		)
	}, [page, posts])

	function deletePost(id: number) {
		fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
			method: 'DELETE'
		}).then(() => {
			setPosts(posts.filter((n) => n.id !== id)) // remove obj com id desejado
			console.log(posts.length)
		})
	}

	function editPost(id: number) {
		fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
			method: 'PUT',
			body: JSON.stringify({
				id: id,
				title: 'foo',
				body: 'bar',
				userId: 1
			}),
			headers: {
				'Content-type': 'application/json; charset=UTF-8'
			}
		})
			.then((response) => response.json())
			.then((json) => {
				/* posts.splice(id, 1, json)
				const newArray = posts
				setPosts(newArray) */
        console.log(json)
        
			})
	}

	function addPost(postTitle: string, postBody: string) {
		fetch('https://jsonplaceholder.typicode.com/posts', {
			method: 'POST',
			body: JSON.stringify({
        id:posts.length + 1,
				title: postTitle,
				body: postBody,
				userId: 1
			}),
			headers: {
				'Content-type': 'application/json; charset=UTF-8'
			}
		})
			.then((response) => response.json())
			.then((json) => {
        posts.push(json)
        setPosts(posts)
      })
	}

	return (
		<main>
			<div className='container'>
				<Button
					size='lg'
					onClick={() => console.log(posts)}
				>
					Log Posts
				</Button>
				<FormComponent posts={posts} setPosts={setPosts} addPost={addPost}/>
				<ul>
					{loading ? (
						<h2>Loading...</h2>
					) : (
						filterData?.map((item, key) => (
							<li
								key={key}
								className='post'
							>
								<h4>
									{item.id} - {item.title}{' '}
									<Button
										size='sm'
										variant='danger'
										onClick={() => deletePost(item.id)}
									>
										DEL
									</Button>
									<Button
										onClick={() => editPost(item.id)}
										size='sm'
									>
										EDIT
									</Button>
								</h4>
								{item.body}
							</li>
						))
					)}
				</ul>
				<ReactPaginate
					containerClassName={'pagination'}
					pageClassName={'page-item'}
					activeClassName={'active'}
					onPageChange={(event) => setPage(event.selected)}
					pageCount={Math.ceil(posts.length / itemsPerPage)}
					breakLabel='...'
					previousLabel={
						<IconContext.Provider value={{ color: '#B8C1CC', size: '36px' }}>
							<AiFillLeftCircle />
						</IconContext.Provider>
					}
					nextLabel={
						<IconContext.Provider value={{ color: '#B8C1CC', size: '36px' }}>
							<AiFillRightCircle />
						</IconContext.Provider>
					}
				/>
			</div>
		</main>
	)
}
