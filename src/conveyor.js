import * as THREE from 'three';
import { createPalette } from './palette';

export function createConveyor(length, width) {
  const group = new THREE.Group();
  const height = 0.4;

  // Base du convoyeur (structure principale)
  const baseGeometry = new THREE.BoxGeometry(length, 0.05, width);
  const baseMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x2c3e50,
    metalness: 0.7,
    roughness: 0.3
  });
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.position.y = height;
  group.add(base);

  // Rails latéraux
  const railHeight = 0.08;
  const railGeometry = new THREE.BoxGeometry(length, railHeight, 0.03);
  const railMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x7f8c8d,
    metalness: 0.8,
    roughness: 0.2
  });

  const leftRail = new THREE.Mesh(railGeometry, railMaterial);
  leftRail.position.set(0, height + railHeight/2, width/2);
  group.add(leftRail);

  const rightRail = new THREE.Mesh(railGeometry, railMaterial);
  rightRail.position.set(0, height + railHeight/2, -width/2);
  group.add(rightRail);

  // Pieds du convoyeur
  const legMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x34495e,
    metalness: 0.6,
    roughness: 0.4
  });
  
  // Nombre de paires de pieds basé sur la longueur
  const legPairs = Math.max(2, Math.floor(length / 2));
  const legSpacing = length / (legPairs - 1);
  const legWidth = 0.05;
  const legDepth = 0.05;

  for (let i = 0; i < legPairs; i++) {
    // Pied gauche
    const leftLegGeometry = new THREE.BoxGeometry(legWidth, height, legDepth);
    const leftLeg = new THREE.Mesh(leftLegGeometry, legMaterial);
    leftLeg.position.set(-length/2 + i * legSpacing, height/2, width/2 - legWidth/2);
    group.add(leftLeg);

    // Pied droit
    const rightLegGeometry = new THREE.BoxGeometry(legWidth, height, legDepth);
    const rightLeg = new THREE.Mesh(rightLegGeometry, legMaterial);
    rightLeg.position.set(-length/2 + i * legSpacing, height/2, -width/2 + legWidth/2);
    group.add(rightLeg);

    // Barre de renfort horizontale
    const supportGeometry = new THREE.BoxGeometry(legWidth, legWidth, width);
    const support = new THREE.Mesh(supportGeometry, legMaterial);
    support.position.set(-length/2 + i * legSpacing, height/4, 0);
    group.add(support);
  }

  // Rouleaux
  const rollerCount = Math.floor(length / 0.15); // Augmentation de la densité des rouleaux
  const rollerGeometry = new THREE.CylinderGeometry(0.025, 0.025, width - 0.1, 16);
  const rollerMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x95a5a6,
    metalness: 0.9,
    roughness: 0.1
  });

  for (let i = 0; i < rollerCount; i++) {
    const roller = new THREE.Mesh(rollerGeometry, rollerMaterial);
    roller.rotation.z = Math.PI / 2;
    roller.position.set(-length/2 + (i + 0.5) * (length/rollerCount), height + 0.03, 0);
    group.add(roller);
  }

  // Moteur (boîtier latéral)
  const motorGeometry = new THREE.BoxGeometry(0.2, 0.15, 0.15);
  const motorMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xe74c3c,
    metalness: 0.5,
    roughness: 0.5
  });
  const motor = new THREE.Mesh(motorGeometry, motorMaterial);
  motor.position.set(-length/2 + 0.1, height, width/2 + 0.1);
  group.add(motor);

  // Centrer le groupe
  group.position.x = length/2;
  // Ajout de la palette
  const palette = createPalette();
  palette.position.set(-length/2, height, 0);
  group.add(palette);

  // Stocker la palette dans une propriété du groupe pour l'animation
  group.palette = palette;
  group.conveyorLength = length;
  
  return group;
}

export function createRotaryTable(diameter) {
  const group = new THREE.Group();
  const height = 0.4; // 40cm de hauteur

  // Plateau rotatif
  const tableMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x2c3e50,
    metalness: 0.7,
    roughness: 0.3
  });

  // Base circulaire principale
  const baseGeometry = new THREE.CylinderGeometry(diameter/2, diameter/2, 0.05, 32);
  const base = new THREE.Mesh(baseGeometry, tableMaterial);
  base.position.y = height;
  group.add(base);

  // Anneau extérieur
  const ringGeometry = new THREE.TorusGeometry(diameter/2, 0.03, 16, 32);
  const ringMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x7f8c8d,
    metalness: 0.8,
    roughness: 0.2
  });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.position.y = height + 0.04;
  ring.rotation.x = Math.PI/2;
  group.add(ring);

  // Pieds
  const legMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x34495e,
    metalness: 0.6,
    roughness: 0.4
  });

  // Création de 4 pieds
  const legPositions = [
    { x: diameter/3, z: diameter/3 },
    { x: -diameter/3, z: diameter/3 },
    { x: diameter/3, z: -diameter/3 },
    { x: -diameter/3, z: -diameter/3 }
  ];

  legPositions.forEach(pos => {
    // Pied vertical
    const legGeometry = new THREE.BoxGeometry(0.05, height, 0.05);
    const leg = new THREE.Mesh(legGeometry, legMaterial);
    leg.position.set(pos.x, height/2, pos.z);
    group.add(leg);

    // Supports diagonaux
    const supportHeight = Math.sqrt(pos.x * pos.x + pos.z * pos.z);
    const supportGeometry = new THREE.BoxGeometry(0.03, supportHeight, 0.03);
    const support = new THREE.Mesh(supportGeometry, legMaterial);
    
    // Positionner et orienter le support diagonal
    support.position.set(pos.x/2, height/2, pos.z/2);
    support.lookAt(new THREE.Vector3(0, height, 0));
    group.add(support);
  });

  // Moteur (boîtier sous la table)
  const motorGeometry = new THREE.BoxGeometry(0.2, 0.15, 0.2);
  const motorMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xe74c3c,
    metalness: 0.5,
    roughness: 0.5
  });
  const motor = new THREE.Mesh(motorGeometry, motorMaterial);
  motor.position.set(0, height - 0.15, 0);
  group.add(motor);

  // Motif sur le dessus pour visualiser la rotation
  const lineGeometry = new THREE.BoxGeometry(diameter * 0.8, 0.01, 0.05);
  const lineMaterial = new THREE.MeshPhongMaterial({ color: 0xecf0f1 });
  const line = new THREE.Mesh(lineGeometry, lineMaterial);
  line.position.y = height + 0.03;
  group.add(line);

  // Cercles concentriques pour l'effet visuel
  for (let i = 1; i <= 3; i++) {
    const circleGeometry = new THREE.TorusGeometry(diameter * i/8, 0.01, 8, 32);
    const circle = new THREE.Mesh(circleGeometry, lineMaterial);
    circle.position.y = height + 0.03;
    circle.rotation.x = Math.PI/2;
    group.add(circle);
  }

  // Ajout de la palette
  const palette = createPalette();
  palette.position.set(0, height, 0);
  group.add(palette);

  // Stocker la palette et les propriétés pour l'animation
  group.palette = palette;
  group.rotationAngle = 0;
  
  return group;
}

// Fonction d'animation pour les convoyeurs
export function animateConveyor(conveyor, deltaTime) {
  if (conveyor.palette) {
    if (conveyor.type === "Rouleau") {
      // Vitesse de déplacement (mètres par seconde)
      const speed = 1;
      
      // Déplacer la palette
      conveyor.palette.position.x += speed * deltaTime;
      
      // Si la palette atteint la fin, la replacer au début
      if (conveyor.palette.position.x > conveyor.conveyorLength/2) {
        conveyor.palette.position.x = -conveyor.conveyorLength/2;
      }

      // Animation des rouleaux
      conveyor.children.forEach(child => {
        if (child.geometry instanceof THREE.CylinderGeometry) {
          child.rotation.x += deltaTime * 2;
        }
      });
    } 
    else if (conveyor.type === "Rotative") {
      // Vitesse de rotation (radians par seconde)
      const rotationSpeed = 0.5;
      
      // Faire tourner la palette autour du centre
      conveyor.rotationAngle += rotationSpeed * deltaTime;
      conveyor.palette.rotation.y = conveyor.rotationAngle;
    }
  }
}
