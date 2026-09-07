/**
 * Industrial IoT & Smart Factory Curated Visual Assets
 * High-resolution, reliable industrial imagery from Unsplash with optimized compression
 */

export const INDUSTRIAL_IMAGES = {
  // Split-screen Login / Hero: Advanced Robotic Manufacturing Line & Smart Automation
  LOGIN_HERO: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80',
  
  // Dashboard Command Center Hero: Advanced SCADA Control Room & Operations Floor
  DASHBOARD_HERO: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=1600&q=80',
  
  // Asset Management Banner: Heavy Precision Machining & Industrial Engineering
  ASSETS_HERO: 'https://images.unsplash.com/photo-1581092335878-2d9ff86ca2bf?auto=format&fit=crop&w=1600&q=80',
  
  // Predictive Maintenance Banner: Field Engineer Inspecting Automation Hardware
  MAINTENANCE_HERO: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1600&q=80',
  
  // Live Condition Monitoring Banner: Industrial Sensors & Electronic Hardware Telemetry
  HEALTH_HERO: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80',
  
  // Enterprise Analytics / Reports Banner: Manufacturing Intelligence & Operations Analytics
  REPORTS_HERO: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80',
};

// Category-Specific Imagery for Digital Twin Machine Profiles in AssetDetailsModal
export const EQUIPMENT_CATEGORY_IMAGES = {
  TURBINE: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=900&q=80',
  GENERATOR: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=900&q=80',
  ROBOTIC: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80',
  ROBOT: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80',
  AUTOMATION: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80',
  PUMP: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=900&q=80',
  COMPRESSOR: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=900&q=80',
  CNC: 'https://images.unsplash.com/photo-1581092335878-2d9ff86ca2bf?auto=format&fit=crop&w=900&q=80',
  MACHINING: 'https://images.unsplash.com/photo-1581092335878-2d9ff86ca2bf?auto=format&fit=crop&w=900&q=80',
  CONVEYOR: 'https://images.unsplash.com/photo-1581092335878-2d9ff86ca2bf?auto=format&fit=crop&w=900&q=80',
  MOTOR: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=900&q=80',
  DEFAULT: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=900&q=80',
};

/**
 * Returns a matching category image URL for an equipment unit
 * @param {string} category 
 * @returns {string} Image URL
 */
export const getEquipmentImage = (category = '') => {
  if (!category) return EQUIPMENT_CATEGORY_IMAGES.DEFAULT;
  const upper = category.toUpperCase();
  for (const key of Object.keys(EQUIPMENT_CATEGORY_IMAGES)) {
    if (upper.includes(key)) {
      return EQUIPMENT_CATEGORY_IMAGES[key];
    }
  }
  return EQUIPMENT_CATEGORY_IMAGES.DEFAULT;
};
