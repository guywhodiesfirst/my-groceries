import Card from "../Card/Card"
import "./MainPage.css"
import data from "../../data"
import { useState } from "react"
import Pagination from "../Pagination/Pagination"
import Categories from "../Categories/Categories"

export default function MainPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(8)

  const lastItemIndex = currentPage * itemsPerPage
  const firstItemIndex = lastItemIndex - itemsPerPage
  const currentItems = data.slice(firstItemIndex, lastItemIndex)

  const cardArray = currentItems.map(itemData => (
    <Card 
      key={itemData.id}
      {...itemData}
    />
  ))

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  return (
  <>
      <div className="main-page">
        <div className="catalog">
            <Pagination 
              totalItems = {data.length}
              itemsPerPage = {itemsPerPage}
              handlePageChange = {handlePageChange}
              currentPage = {currentPage}
            />
            <div className="cards-container">
                {cardArray}
            </div>
        </div>
        <div>
          <Categories />
        </div>
      </div>
  </>
  )
}