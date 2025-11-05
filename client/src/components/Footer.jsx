import { LocationOn, LocalPhone, Email } from '@mui/icons-material'

const Footer = () => {
  return (
    <footer className="flex items-center justify-between gap-12 px-[70px] py-2 lg:px-[30px]">
      {/* Left */}
      <div className="max-w-[400px]">
        <a href="/" className="inline-block">
          <img
            src="/assets/logo.png"
            alt="logo"
            className="max-w-[150px] mb-5"
          />
        </a>

        {/* Example socials block (optional) */}
        {/* <div className="flex gap-6 mt-5">
          <button
            type="button"
            className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-110"
            aria-label="social icon"
          >
            S
          </button>
        </div> */}
      </div>

      {/* Center (hidden from md and below) */}
      <div className="hidden md:block">
        <h3 className="text-lg font-semibold">Useful Links</h3>
        <ul className="list-none mt-5 cursor-pointer">
          <li className="hover:text-rose-500 transition-colors">About Us</li>
          <li className="hover:text-rose-500 transition-colors">Terms and Conditions</li>
          <li className="hover:text-rose-500 transition-colors">Return and Refund Policy</li>
        </ul>
      </div>

      {/* Right (hidden on small screens) */}
      <div className="hidden sm:block max-w-[350px]">
        <h3 className="text-lg font-semibold mb-5">Contact</h3>

        <div className="flex items-start">
          <LocalPhone className="mt-0.5" />
          <p className="ml-5 mb-4">+1 234 567 890</p>
        </div>

        <div className="flex items-start">
          <Email className="mt-0.5" />
          <p className="ml-5 mb-4">dreamnest@support.com</p>
        </div>

        <img src="/assets/payment.png" alt="payment" className="mt-2" />
      </div>
    </footer>
  )
}

export default Footer
