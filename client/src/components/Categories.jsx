import { Link } from 'react-router-dom'
import { categories } from '../data.jsx'

const Categories = () => {
  return (
    <section className="bg-gray-100 px-5 sm:px-5 md:px-10 lg:px-14 xl:px-16 py-12 flex flex-col items-center text-center">
      <h1 className="text-blue-600 text-3xl md:text-4xl font-extrabold mb-4">
        Explore Top Categories
      </h1>

      <p className="max-w-[700px] text-lg md:text-xl">
        Explore our wide range of vacation rentals that cater to all types of travelers. Immerse yourself in the local culture, enjoy the comforts of home, and create unforgettable memories in your dream destination.
      </p>

      <div className="flex flex-wrap justify-center gap-5 py-12">
        {categories?.slice(1, 7).map((category, index) => (
          <Link
            key={index}
            to={`/properties/category/${category.label}`}
            className="no-underline"
          >
            <div className="relative flex items-center justify-center w-[250px] h-[200px] cursor-pointer overflow-hidden rounded-md">
              <img
                src={category.img}
                alt={category.label}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* overlay with hover shrink effect */}
              <div className="absolute inset-0 bg-black/55 transition-all duration-300 hover:scale-90" />

              {/* text + icon */}
              <div className="relative text-white flex flex-col items-center gap-1">
                <div className="text-[45px] leading-none">
                  {category.icon}
                </div>
                <p className="font-semibold">{category.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default Categories
