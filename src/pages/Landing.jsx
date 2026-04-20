import { Link } from 'react-router';

function Landing() {
	return (
		<main className="absolute left-0 top-0 flex h-screen w-screen items-center justify-center p-4">
			<section className="flex h-3/5 w-4/7 flex-col gap-10 items-center justify-center rounded-4xl bg-[#1e1e1eae] px-40 pt-5 backdrop-blur-sm">
				<h1 className="font-['Poppins'] text-center text-6xl font-bold uppercase tracking-wide text-white">
					welcome to connect-four
				</h1>
				<Link
					to="/game"
					className="blink-opacity-link font-['Poppins'] text-3xl font-semibold uppercase tracking-wide text-white"
				>
					-start playing-
				</Link>
			</section>
		</main>
	)
}

export default Landing
