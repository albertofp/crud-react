import { useState, useRef } from 'react'
import { Button } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import { Post } from './App'

type showEdit = {
	show: boolean
	item: number
	currentBody: string
	currentTitle: string
}
type FormProps = {
	posts: Post[]
	setPosts: React.Dispatch<React.SetStateAction<Post[]>>
	id: number
	currentTitle: string
	currentBody: string
	showEdit: showEdit
	setShowEdit: React.Dispatch<React.SetStateAction<showEdit>>
	setFilterData: React.Dispatch<React.SetStateAction<Post[] | undefined>>
    page:number 
    itemsPerPage: number
}

export default function EditFormt({
	posts,
	setPosts,
	id,
	currentTitle,
	currentBody,
	showEdit,
	setShowEdit,
	setFilterData,
	page,
	itemsPerPage
}: FormProps) {
	const [validated, setValidated] = useState(false)
	const [formValues, setFormValues] = useState<{ body: string; title: string }>(
		{ body: currentBody, title: currentTitle }
	)
	const setField = (field: string, value: string) => {
		setFormValues({
			...formValues,
			[field]: value
		})
	}

	const handleSubmit = (event: any) => {
		const form = event.currentTarget
		event.preventDefault()
		if (form.checkValidity() === false) {
			event.stopPropagation()
		}
		setValidated(true)
		edit()
	}

	function edit() {
		fetch('https://jsonplaceholder.typicode.com/posts/1', {
			method: 'PUT',
			body: JSON.stringify({
				id: id,
				title: formValues.title,
				body: formValues.body,
				userId: 1
			}),
			headers: {
				'Content-type': 'application/json; charset=UTF-8'
			}
		})
			.then((response) => response.json())
			.finally(() => {
				posts.splice(id - 1, 1, {
					id: id,
					title: formValues.title,
					body: formValues.body,
					userId: 1
				})
				const newArray = posts
				console.log(posts)
				setPosts(newArray)
				setFilterData(
					posts.filter((item, index) => {
						return (
							index >= page * itemsPerPage && index < (page + 1) * itemsPerPage
						)
					})
				)

				//Reset
				setShowEdit({
					show: false,
					item: 1,
					currentBody: '',
					currentTitle: ''
				})
			})
	}

	return (
		<Form onSubmit={handleSubmit}>
			<Form.Group
				className='mb-3'
				controlId='formBasicTitle'
			>
				<Form.Label>Title</Form.Label>
				<Form.Control
					type='text'
					placeholder={currentTitle}
					required
					defaultValue={currentTitle}
					onChange={(e) => setField('title', e.target.value)}
				/>
				<Form.Control.Feedback type='invalid'>
					Insira título
				</Form.Control.Feedback>
			</Form.Group>

			<Form.Group
				className='mb-3'
				controlId='formBasicBody'
			>
				<Form.Label>Body</Form.Label>
				<Form.Control
					type='text'
					as={'textarea'}
					placeholder={currentBody}
					required
					defaultValue={currentBody}
					onChange={(e) => setField('body', e.target.value)}
				/>
				<Form.Control.Feedback type='invalid'>
					Insira texto
				</Form.Control.Feedback>
			</Form.Group>
			<Button
				variant='success'
				type='submit'
			>
				Edit Post
			</Button>
		</Form>
	)
}
