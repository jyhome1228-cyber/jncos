(() => {
  const grid = document.querySelector('.oem-pack-grid');
  if (!grid) return;

  const data = {
    'Bottle': {
      eyebrow: 'PRIMARY CONTAINER',
      intro: 'Versatile rigid packaging used across daily skincare and personal-care categories.',
      products: ['Toner', 'Essence', 'Lotion', 'Body Wash', 'Shampoo', 'Cleansing Water'],
      options: 'PET, PE, glass and selected specialty bottles with screw caps, disc tops or pump closures.',
      checks: 'Formula viscosity, closure compatibility, dispensing flow, decoration area and transport durability.'
    },
    'Tube': {
      eyebrow: 'PRIMARY CONTAINER',
      intro: 'Efficient squeeze packaging for controlled dispensing and travel-friendly product formats.',
      products: ['Cleanser', 'Cream', 'Sunscreen', 'Gel', 'Hair Treatment', 'Body Cream'],
      options: 'PE, laminated and selected mono-material tubes with flip-top, screw or nozzle closures.',
      checks: 'Viscosity, fill temperature, seal performance, orifice size, barrier requirement and artwork method.'
    },
    'Jar': {
      eyebrow: 'PRIMARY CONTAINER',
      intro: 'Premium wide-mouth packaging suited to rich textures and treatment-oriented formulations.',
      products: ['Face Cream', 'Sleeping Mask', 'Balm', 'Body Butter', 'Scrub', 'Treatment Cream'],
      options: 'PP, PET, acrylic-look and glass jars with inner caps, liners and premium finishing options.',
      checks: 'Product exposure, scoop hygiene, liner compatibility, torque, leakage risk and weight during export.'
    },
    'Pouch': {
      eyebrow: 'FLEXIBLE PACKAGING',
      intro: 'Lightweight flexible packaging for single-use, refill and treatment applications.',
      products: ['Sheet Mask', 'Hydrogel Mask', 'Refill Pack', 'Sample Sachet', 'Travel Pack', 'Single-Dose Treatment'],
      options: 'Multi-layer film structures, zipper pouches and custom printed sachets according to barrier needs.',
      checks: 'Film compatibility, seal strength, oxygen/moisture barrier, fill volume and opening experience.'
    },
    'Label': {
      eyebrow: 'DECORATION & INFORMATION',
      intro: 'Pressure-sensitive labeling for product identity, compliance information and variable production data.',
      products: ['Bottle', 'Jar', 'Tube', 'Pouch', 'Sample', 'Outer Carton'],
      options: 'Paper, PP, PET, transparent, matte, textured and specialty adhesive label stocks.',
      checks: 'Surface energy, curvature, moisture exposure, print durability, legal copy and batch-code area.'
    },
    'Carton': {
      eyebrow: 'SECONDARY PACKAGING',
      intro: 'Folding carton systems that protect the product while carrying brand and regulatory information.',
      products: ['Serum', 'Cream', 'Ampoule', 'Sunscreen', 'Mask Set', 'Premium Skincare'],
      options: 'SBS, coated boards, specialty papers, inserts, spot finishing and sustainable material selections.',
      checks: 'Product dimensions, board strength, inserts, print finish, barcode readability and shipping protection.'
    },
    'Sleeve': {
      eyebrow: 'DECORATIVE PACKAGING',
      intro: 'Full-body decoration or tamper-evident finishing for containers requiring strong visual coverage.',
      products: ['Bottle', 'Jar', 'Pump Bottle', 'Promotional Set', 'Travel Product'],
      options: 'Shrink sleeves, neck bands and tamper-evident sleeves with printed or clear film.',
      checks: 'Container geometry, shrink ratio, seam placement, heat sensitivity and barcode distortion.'
    },
    'Secondary Packaging': {
      eyebrow: 'SET & PRESENTATION',
      intro: 'Outer packaging systems that combine, protect and present multiple products as one commercial unit.',
      products: ['Gift Set', 'Trial Kit', 'Routine Set', 'Influencer Kit', 'Launch Set', 'Retail Bundle'],
      options: 'Rigid boxes, folding sets, trays, sleeves, inserts and paper-based presentation structures.',
      checks: 'SKU arrangement, protection, unboxing sequence, shipping efficiency, retail display and cost target.'
    },
    'Export Packaging': {
      eyebrow: 'LOGISTICS SUPPORT',
      intro: 'Transport-ready outer packaging designed to reduce damage during domestic and international shipment.',
      products: ['Finished Goods', 'Bulk Cartons', 'Retail Sets', 'Glass Packaging', 'Pump Products'],
      options: 'Master cartons, dividers, inner cartons, stretch protection and pallet-ready packing formats.',
      checks: 'Carton strength, orientation, drop risk, palletization, humidity, long-distance transit and labeling.'
    },
    'Airless Pump': {
      eyebrow: 'FUNCTIONAL DISPENSING',
      intro: 'Controlled dispensing systems that reduce product exposure to air and support premium skincare positioning.',
      products: ['Serum', 'Emulsion', 'Lotion', 'Cream', 'Eye Treatment', 'Sensitive-Skin Formula'],
      options: 'Piston and pouch-type airless systems in multiple fill volumes and actuator designs.',
      checks: 'Formula viscosity, priming, evacuation rate, actuator dose, compatibility and residual product level.'
    },
    'Dropper': {
      eyebrow: 'PRECISION DISPENSING',
      intro: 'High-control dispensing suited to concentrated and treatment-led skincare products.',
      products: ['Serum', 'Ampoule', 'Facial Oil', 'Booster', 'Concentrate'],
      options: 'Glass or compatible rigid bottles with pipette, push-button or controlled-dose dropper assemblies.',
      checks: 'Formula viscosity, solvent compatibility, pipette material, dosage control, leakage and bulb durability.'
    },
    'Spray': {
      eyebrow: 'MIST & SPRAY SYSTEM',
      intro: 'Fine or directional spray packaging for fluid cosmetic, body and scalp applications.',
      products: ['Facial Mist', 'Toner Mist', 'Scalp Spray', 'Body Mist', 'Hair Treatment', 'Setting-Type Cosmetic'],
      options: 'Fine-mist, treatment spray and selected continuous-spray components depending on formula.',
      checks: 'Particle size, spray pattern, clogging risk, solvent compatibility, pump output and cap security.'
    }
  };

  const panel = document.createElement('section');
  panel.className = 'oem-pack-detail';
  panel.setAttribute('aria-live', 'polite');
  grid.insertAdjacentElement('afterend', panel);

  const items = [...grid.querySelectorAll('.oem-pack-item')];

  const render = (name) => {
    const d = data[name];
    if (!d) return;
    items.forEach((item) => {
      const active = item.textContent.trim() === name;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    panel.innerHTML = `
      <div class="oem-pack-detail-head">
        <span>${d.eyebrow}</span>
        <h3>${name}</h3>
        <p>${d.intro}</p>
      </div>
      <div class="oem-pack-detail-grid">
        <div><span>SUITABLE COSMETIC PRODUCTS</span><p>${d.products.join(' · ')}</p></div>
        <div><span>TYPICAL OPTIONS</span><p>${d.options}</p></div>
        <div><span>DEVELOPMENT CHECKS</span><p>${d.checks}</p></div>
      </div>`;
  };

  items.forEach((item) => {
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.setAttribute('aria-selected', 'false');
    const activate = () => render(item.textContent.trim());
    item.addEventListener('click', activate);
    item.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        activate();
      }
    });
  });

  render(items[0]?.textContent.trim() || 'Bottle');
})();
