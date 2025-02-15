import EditForm from '@/components/EditForm/EditForm'

const ItemPage = async ({ params }: { params: Promise<{ id: string }> }) => {
	const itemId = (await params).id
	const response = await fetch(`http://localhost:3000/api/items/${itemId}`)
	if (!response.ok) {
		return <div>Объявление не найдено</div>
	}

	const ad = await response.json()

	return (
		<div className='space-y-4'>
			<EditForm itemData={ad} />
		</div>
	)
}

export default ItemPage
