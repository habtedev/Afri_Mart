import CartAddItem from './cart-item'

export default async function CartAddItemPage(props: {
  params: Promise<{ ItemID: string }>
}) {
  const { ItemID } = await props.params

  return <CartAddItem itemId={ItemID} />
}