import { LazyLoadImage } from "react-lazy-load-image-component"
import Logo from '../../assets/brand-logo.png';
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center p-3">
        <LazyLoadImage
          src={Logo}
          alt="logo"
          effect="blur"
          className="max-w-[300px]"
        />
        <p className="text-xl text-neutral-300 text-center mt-3 px-3">
          Chatty App built with React, ElectronJS, NestJS, Sequelize, Postgres and Socket.io.
        </p>
        <ul className="list-disc text-xl text-neutral-400 mt-6">
          <li>Converse one-on-one or create channels</li>
          <li>Add friend or block</li>
          <li>Chat with your friends as much as you want.</li>
          <li>In development mode...</li>
        </ul>
        <Link
          to='/addfriend'
          className="bg-neutral-600 rounded-md px-5 py-3 text-xl mt-8">
          Find Your Friends
        </Link>
      </div>
    </div>
  )
}

export default Home
