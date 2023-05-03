import { useState, useRef } from 'react'
import { Button } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import { Post } from './App'

type FormProps = {
	posts: Post[]
	setPosts: React.Dispatch<React.SetStateAction<Post[]>>
}

export default function FormComponent({ posts, setPosts }: FormProps) {
	const [validated, setValidated] = useState(false)
	const [formValues, setFormValues] = useState<{ body: string; title: string }>(
		{ body: '', title: '' }
	)
	const setField = (field: string, value: string) => {
		setFormValues({
			...formValues,
			[field]: value
		})
	}

	function addPost(postTitle: string, postBody: string) {
		fetch('https://jsonplaceholder.typicode.com/posts', {
			method: 'POST',
			body: JSON.stringify({
				title: postTitle,
				body: postBody,
				userId: 1
			}),
			headers: {
				'Content-type': 'application/json; charset=UTF-8'
			}
		})
			.then((response) => response.json())
			.then(() => {
				setPosts(
					// A api sempre responde com um objeto com id=101, por isso 
					// preciso fazer desse jeito. 
					posts.concat({
						id: posts.length + 1,
						title: postTitle,
						body: postBody,
						userId: 1
					})
				)
				console.log(`posts.length : ${posts.length}`)
			})
	}

	const handleSubmit = (event: any) => {
		const form = event.currentTarget
		event.preventDefault()
		if (form.checkValidity() === false) {
			event.stopPropagation()
		}
		setValidated(true)
		addPost(formValues.title, formValues.body)
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
					placeholder='Title'
					required
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
					placeholder='Post body'
					required
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
				Create Post
			</Button>
		</Form>
	)
}
