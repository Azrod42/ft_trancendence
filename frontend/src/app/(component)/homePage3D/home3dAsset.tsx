'use client'
import React, { useRef, useState, useEffect } from 'react'
import { Canvas,  useFrame } from '@react-three/fiber'
import styles from './home3dAsset.module.css'
import { useGLTF, OrbitControls, Box } from '@react-three/drei'
import { useThree } from '@react-three/fiber'

 
const Pong = () => {
	const { scene, animations } = useGLTF('/pong/scene.gltf')
	useFrame((state, delta) => (scene.rotation.y += delta * 0.1))
	return <>
		<primitive object={scene} scale={10} position={[0, -8, 0]} />
	</>
}

const PongBall = () => {
	const { scene, animations } = useGLTF('/pongBall/scene.gltf')
	useFrame((state, delta) => (scene.rotation.y += delta * 0.1))
	return <>
		<primitive object={scene} scale={10} position={[0, -8, 0]} />
	</>
}

// const Ball = (props: any) => {

// 	const ref = useRef();
// 	const speed = Math.random() * (5 - 1) + 1
// 	console.log(ref);
// 	useFrame((state, delta) => {
// 		if (ref.current.position.x <= 15 && ref.current.position.x >= -10) {
// 			ref.current.position.x = Math.random() * (25 - -15) + -15;
// 			ref.current.position.z = Math.random() * (25 - -20) + -20;
// 			ref.current.position.y = Math.random() * (20 - -25) + -25;
// 			ref.current.material.color.r = Math.random() * (1 - 0) + 0;
// 			ref.current.material.color.g = Math.random() * (1 - 0) + 0;
// 			ref.current.material.color.b = Math.random() * (1 - 0) + 0;
// 		}
// 		if (ref.current.position.y >= 30) {
// 			ref.current.position.y = Math.random() * (-20 - -30) + -30;
// 		}
// 		ref.current.position.y += delta * 2
// 		}
// 	);
// 	return (
// 	<mesh {...props}
// 		ref={ref}
// 	>
// 		<sphereGeometry args={[1, 22]} position={[0, 150, 0]} />
// 		<meshStandardMaterial color='red' />
//   	</mesh>
// 	)
// }

interface Home3DProps {

}

const Home3D: React.FC<Home3DProps> = ({}) => {


  return (
	<div className={styles.container}>
		<Canvas camera={{ fov: 75, position: [25, 5, 5]}}>
			<OrbitControls />
			<ambientLight intensity={1} />
			{/* <pointLight position={[10, 10, 10]} /> */}
			<Pong />
			{/* <Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball />
			<Ball /> */}
		</Canvas>
	</div>
  )
}

export default Home3D;
