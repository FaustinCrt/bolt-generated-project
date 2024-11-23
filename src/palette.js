import * as THREE from 'three';

export function createPalette() {
  const group = new THREE.Group();
  
  // Dimensions standard d'une palette
  const width = 1.2;  // 120cm
  const length = 0.8; // 80cm
  const height = 0.144; // 14.4cm

  // Création de la palette
  const paletteGeometry = new THREE.BoxGeometry(length, height, width);
  const paletteMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x8b4513,
    roughness: 0.8,
    metalness: 0.2
  });
  
  const palette = new THREE.Mesh(paletteGeometry, paletteMaterial);
  palette.position.y = height/2;
  group.add(palette);

  // Ajout des lattes
  const latteGeometry = new THREE.BoxGeometry(length, height/3, 0.1);
  const latteMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x654321,
    roughness: 0.9,
    metalness: 0.1
  });

  [-width/3, 0, width/3].forEach(position => {
    const latte = new THREE.Mesh(latteGeometry, latteMaterial);
    latte.position.set(0, height/3, position);
    group.add(latte);
  });

  return group;
}
