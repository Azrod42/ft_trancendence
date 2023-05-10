'use client'

const error = ({error, reset}: {error: Error, reset: () => void}) => {
	return ( <div>error <button onClick={reset}>Try again</button></div> );
}

export default error;