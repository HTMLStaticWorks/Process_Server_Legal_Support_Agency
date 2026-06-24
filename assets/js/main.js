/**
 * main.js - Global interactions for Aegis Process Serving & Legal Support
 */

document.addEventListener('DOMContentLoaded', () => {
    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const htmlElement = document.documentElement;
    
    // Check local storage for preference
    if (localStorage.getItem('theme') === 'dark') {
        htmlElement.setAttribute('data-theme', 'dark');
        updateDarkModeIcon(true);
    }

    darkModeToggle?.addEventListener('click', () => {
        const isDark = htmlElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
            htmlElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            updateDarkModeIcon(false);
        } else {
            htmlElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            updateDarkModeIcon(true);
        }
    });

    function updateDarkModeIcon(isDark) {
        const icon = darkModeToggle?.querySelector('i');
        if (icon) {
            icon.className = isDark ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
        }
    }

    // RTL Toggle
    const rtlToggle = document.getElementById('rtl-toggle');
    if (localStorage.getItem('dir') === 'rtl') {
        htmlElement.setAttribute('dir', 'rtl');
        updateRTLText(true);
    }

    rtlToggle?.addEventListener('click', () => {
        const isRtl = htmlElement.getAttribute('dir') === 'rtl';
        if (isRtl) {
            htmlElement.removeAttribute('dir');
            localStorage.setItem('dir', 'ltr');
            updateRTLText(false);
        } else {
            htmlElement.setAttribute('dir', 'rtl');
            localStorage.setItem('dir', 'rtl');
            updateRTLText(true);
        }
    });

    function updateRTLText(isRtl) {
        if (rtlToggle) {
            rtlToggle.setAttribute('title', isRtl ? 'Switch to LTR' : 'Switch to RTL');
            const icon = rtlToggle.querySelector('i');
            if (icon) {
                icon.style.transform = isRtl ? 'rotate(180deg)' : 'rotate(0deg)';
                icon.style.transition = 'transform 0.3s ease';
                icon.style.display = 'inline-block';
            }
        }
    }

    // Sticky Navbar
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar?.classList.add('sticky-top', 'shadow-sm');
        } else {
            navbar?.classList.remove('sticky-top', 'shadow-sm');
        }
    });

    // Mobile Menu Close on link click
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.getElementById('navbarNav');
    if (menuToggle) {
        const bsCollapse = new bootstrap.Collapse(menuToggle, {toggle:false});
        navLinks.forEach((l) => {
            l.addEventListener('click', () => { 
                if(window.innerWidth < 992) {
                    bsCollapse.hide();
                }
            });
        });
    }

    // Back to Top Button
    const backToTopBtn = document.createElement('a');
    backToTopBtn.innerHTML = '<i class="bi bi-arrow-up"></i>';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('href', '#');
    backToTopBtn.setAttribute('title', 'Back to Top');
    document.body.appendChild(backToTopBtn);

    const handleScroll = () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    };
    window.addEventListener('scroll', handleScroll);

    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ==========================================
    // RUSH CALCULATOR LOGIC (pricing.html)
    // ==========================================
    const calcOptions = document.querySelectorAll('.calc-card-option');
    const calcNotarize = document.getElementById('calcNotarize');
    const calcExtraAttempts = document.getElementById('calcExtraAttempts');
    const totalPriceEl = document.getElementById('totalPrice');
    const summaryBaseEl = document.getElementById('summaryBase');
    const summarySpeedEl = document.getElementById('summarySpeed');
    const summaryZoneEl = document.getElementById('summaryZone');
    const summaryAddonsEl = document.getElementById('summaryAddons');
    const bookCalculatedBtn = document.getElementById('bookCalculatedBtn');

    if (totalPriceEl) {
        // Init Calculator Event Listeners
        calcOptions.forEach(opt => {
            opt.addEventListener('click', function() {
                const type = this.getAttribute('data-type');
                // Deactivate sibling options
                document.querySelectorAll(`.calc-card-option[data-type="${type}"]`).forEach(sibling => {
                    sibling.classList.remove('active');
                });
                // Activate clicked
                this.classList.add('active');
                calculatePrice();
            });
        });

        [calcNotarize, calcExtraAttempts].forEach(chk => {
            chk?.addEventListener('change', calculatePrice);
        });

        function calculatePrice() {
            // Get selected values
            const activeService = document.querySelector('.calc-card-option[data-type="service"].active');
            const activeSpeed = document.querySelector('.calc-card-option[data-type="speed"].active');
            const activeZone = document.querySelector('.calc-card-option[data-type="zone"].active');

            const baseVal = activeService ? parseFloat(activeService.getAttribute('data-base')) : 75;
            const speedVal = activeSpeed ? parseFloat(activeSpeed.getAttribute('data-addon')) : 0;
            const zoneVal = activeZone ? parseFloat(activeZone.getAttribute('data-addon')) : 0;

            let addonsVal = 0;
            if (calcNotarize && calcNotarize.checked) addonsVal += parseFloat(calcNotarize.getAttribute('data-addon'));
            if (calcExtraAttempts && calcExtraAttempts.checked) addonsVal += parseFloat(calcExtraAttempts.getAttribute('data-addon'));

            const finalPrice = baseVal + speedVal + zoneVal + addonsVal;

            // Render
            totalPriceEl.textContent = `$${finalPrice}`;
            if (summaryBaseEl) summaryBaseEl.textContent = `$${baseVal}`;
            if (summarySpeedEl) summarySpeedEl.textContent = `$${speedVal}`;
            if (summaryZoneEl) summaryZoneEl.textContent = `$${zoneVal}`;
            if (summaryAddonsEl) summaryAddonsEl.textContent = `$${addonsVal}`;

            // Render selected text details
            const summaryServiceText = document.getElementById('summaryServiceText');
            const summarySpeedText = document.getElementById('summarySpeedText');
            const summaryZoneText = document.getElementById('summaryZoneText');

            if (summaryServiceText && activeService) {
                const titleNode = activeService.querySelector('.fw-bold');
                summaryServiceText.textContent = titleNode ? titleNode.textContent : 'Subpoena';
            }
            if (summarySpeedText && activeSpeed) {
                const titleNode = activeSpeed.querySelector('.fw-bold');
                let text = titleNode ? titleNode.textContent : 'Standard';
                text = text.split(' (')[0];
                summarySpeedText.textContent = text;
            }
            if (summaryZoneText && activeZone) {
                const titleNode = activeZone.querySelector('.fw-bold');
                let text = titleNode ? titleNode.textContent : 'Local Zone';
                text = text.split(' (')[0];
                summaryZoneText.textContent = text;
            }

            // Animation effect
            totalPriceEl.classList.remove('price-changed');
            void totalPriceEl.offsetWidth; // Trigger reflow
            totalPriceEl.classList.add('price-changed');
        }

        // Redirect to booking with parameters
        bookCalculatedBtn?.addEventListener('click', () => {
            const activeService = document.querySelector('.calc-card-option[data-type="service"].active')?.getAttribute('data-value') || 'subpoena';
            const activeSpeed = document.querySelector('.calc-card-option[data-type="speed"].active')?.getAttribute('data-value') || 'standard';
            const activeZone = document.querySelector('.calc-card-option[data-type="zone"].active')?.getAttribute('data-value') || 'local';
            const notarize = calcNotarize?.checked ? '1' : '0';
            const extra = calcExtraAttempts?.checked ? '1' : '0';

            const bookingUrl = `contact.html?service=${activeService}&speed=${activeSpeed}&zone=${activeZone}&notarize=${notarize}&extra=${extra}`;
            window.location.href = bookingUrl;
        });

        // Run initial calculation
        calculatePrice();
    }

    // ==========================================
    // SERVICE REQUEST FORM LOGIC (contact.html)
    // ==========================================
    const requestForm = document.getElementById('serviceRequestForm');
    const successView = document.getElementById('formSuccessView');
    
    if (requestForm) {
        const nextBtns = document.querySelectorAll('.next-step-btn');
        const prevBtns = document.querySelectorAll('.prev-step-btn');
        const steps = document.querySelectorAll('.form-step-content');
        const stepDots = document.querySelectorAll('.form-step-dot');

        // Drag and Drop Elements
        const dragZone = document.getElementById('fileDragZone');
        const fileField = document.getElementById('formFileField');
        const fileListContainer = document.getElementById('fileListContainer');
        const progressWrapper = document.getElementById('progressWrapper');
        const progressBar = document.getElementById('progressBar');
        const progressPercent = document.getElementById('progressPercent');

        let uploadedFiles = [];

        // Parse query params to auto-fill Step 1
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('service')) {
            const serviceVal = urlParams.get('service');
            const speedVal = urlParams.get('speed');
            const zoneVal = urlParams.get('zone');
            const notarizeVal = urlParams.get('notarize');

            const serviceSelect = document.getElementById('formServiceType');
            const speedSelect = document.getElementById('formSpeed');
            const zoneSelect = document.getElementById('formZone');
            const notarizeCheck = document.getElementById('formNotarize');

            if (serviceSelect) serviceSelect.value = serviceVal;
            if (speedSelect) speedSelect.value = speedVal;
            if (zoneSelect) zoneSelect.value = zoneVal;
            if (notarizeCheck) notarizeCheck.checked = (notarizeVal === '1');
        }

        // Multi-Step Form Navigation
        nextBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const currentStepNum = parseInt(this.getAttribute('data-current'));
                
                // Validate current step fields
                if (validateStep(currentStepNum)) {
                    goToStep(currentStepNum + 1);
                }
            });
        });

        prevBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const currentStepNum = parseInt(this.getAttribute('data-current'));
                goToStep(currentStepNum - 1);
            });
        });

        function goToStep(stepNum) {
            steps.forEach((step, idx) => {
                step.classList.toggle('active', idx === (stepNum - 1));
            });
            stepDots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === (stepNum - 1));
                dot.classList.toggle('completed', idx < (stepNum - 1));
            });
        }

        function validateStep(stepNum) {
            const container = document.getElementById(`stepContent${stepNum}`);
            if (!container) return true;

            const inputs = container.querySelectorAll('input[required], select[required], textarea[required]');
            let isValid = true;

            inputs.forEach(input => {
                if (!input.value.trim() || (input.tagName === 'SELECT' && input.selectedIndex === 0)) {
                    input.classList.add('is-invalid');
                    isValid = false;
                } else {
                    input.classList.remove('is-invalid');
                }
            });

            return isValid;
        }

        // Clear invalid classes on input change
        requestForm.querySelectorAll('input, select, textarea').forEach(el => {
            el.addEventListener('input', function() {
                this.classList.remove('is-invalid');
            });
            el.addEventListener('change', function() {
                this.classList.remove('is-invalid');
            });
        });

        // Drag & Drop Functionality
        dragZone?.addEventListener('click', () => fileField?.click());

        dragZone?.addEventListener('dragover', (e) => {
            e.preventDefault();
            dragZone.classList.add('dragover');
        });

        ['dragleave', 'dragend'].forEach(evt => {
            dragZone?.addEventListener(evt, () => {
                dragZone.classList.remove('dragover');
            });
        });

        dragZone?.addEventListener('drop', (e) => {
            e.preventDefault();
            dragZone.classList.remove('dragover');
            if (e.dataTransfer.files.length) {
                handleFileAddition(e.dataTransfer.files);
            }
        });

        fileField?.addEventListener('change', (e) => {
            if (e.target.files.length) {
                handleFileAddition(e.target.files);
            }
        });

        function handleFileAddition(files) {
            const validFiles = [];
            const maxSize = 25 * 1024 * 1024; // 25MB

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const ext = file.name.split('.').pop().toLowerCase();
                
                if (!['pdf', 'doc', 'docx'].includes(ext)) {
                    alert(`Invalid file format for "${file.name}". Only PDFs, DOC, and DOCX files are allowed.`);
                    continue;
                }
                if (file.size > maxSize) {
                    alert(`File "${file.name}" is too large. Maximum allowed size is 25MB.`);
                    continue;
                }
                validFiles.push(file);
            }

            if (validFiles.length) {
                simulateUpload(validFiles);
            }
        }

        function simulateUpload(files) {
            if (progressWrapper) progressWrapper.classList.remove('d-none');
            let progress = 0;

            const interval = setInterval(() => {
                progress += 10;
                if (progressBar) progressBar.style.width = `${progress}%`;
                if (progressPercent) progressPercent.textContent = `${progress}%`;

                if (progress >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        if (progressWrapper) progressWrapper.classList.add('d-none');
                        // Add files to list
                        files.forEach(f => {
                            uploadedFiles.push(f);
                        });
                        renderUploadedFiles();
                    }, 300);
                }
            }, 80);
        }

        function renderUploadedFiles() {
            if (!fileListContainer) return;
            fileListContainer.innerHTML = '';

            uploadedFiles.forEach((file, idx) => {
                const item = document.createElement('div');
                item.className = 'uploaded-file-item';
                
                const sizeKB = (file.size / 1024).toFixed(1);
                const sizeDisplay = sizeKB > 1000 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`;

                item.innerHTML = `
                    <div class="file-info">
                        <i class="bi bi-file-earmark-check text-gold fs-4" style="color: var(--secondary-color);"></i>
                        <div>
                            <div class="file-name">${file.name}</div>
                            <div class="file-size">${sizeDisplay}</div>
                        </div>
                    </div>
                    <button type="button" class="remove-file-btn" data-index="${idx}">
                        <i class="bi bi-trash"></i>
                    </button>
                `;
                fileListContainer.appendChild(item);
            });

            // Bind delete button listeners
            fileListContainer.querySelectorAll('.remove-file-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const idx = parseInt(this.getAttribute('data-index'));
                    uploadedFiles.splice(idx, 1);
                    renderUploadedFiles();
                });
            });
        }

        // Form Submit Handler
        requestForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validate Step 4
            const authCheck = document.getElementById('authCheck');
            if (authCheck && !authCheck.checked) {
                authCheck.classList.add('is-invalid');
                return;
            }

            // Calculate final price breakdown for success display
            const serviceSel = document.getElementById('formServiceType');
            const speedSel = document.getElementById('formSpeed');
            const zoneSel = document.getElementById('formZone');
            const notarizeChk = document.getElementById('formNotarize');

            const serviceText = serviceSel ? serviceSel.options[serviceSel.selectedIndex].text : 'Service of Process';
            const speedText = speedSel ? speedSel.options[speedSel.selectedIndex].text : 'Standard';
            const firmName = document.getElementById('formFirmName')?.value || 'N/A';
            const targetName = document.getElementById('formTargetName')?.value || 'N/A';

            // Prices
            let base = 75;
            if (serviceSel?.value === 'summons') base = 85;
            if (serviceSel?.value === 'filing') base = 60;
            if (serviceSel?.value === 'retrieval') base = 55;
            if (serviceSel?.value === 'skiptrace') base = 95;

            let speedAddon = 0;
            if (speedSel?.value === 'rush') speedAddon = 45;
            if (speedSel?.value === 'sameday') speedAddon = 90;

            let zoneAddon = 0;
            if (zoneSel?.value === 'extended') zoneAddon = 25;
            if (zoneSel?.value === 'remote') zoneAddon = 60;

            let addonTotal = 0;
            if (notarizeChk && notarizeChk.checked) addonTotal += 15;

            const finalAmt = base + speedAddon + zoneAddon + addonTotal;

            // Generate mock reference code
            const refCode = `VLS-2026-${Math.floor(1000 + Math.random() * 9000)}`;

            // Populate Success View
            const succCaseId = document.getElementById('successCaseId');
            const succFirm = document.getElementById('successFirm');
            const succTarget = document.getElementById('successTarget');
            const succService = document.getElementById('successService');
            const succSpeed = document.getElementById('successSpeed');
            const succTotal = document.getElementById('successTotal');

            if (succCaseId) succCaseId.textContent = refCode;
            if (succFirm) succFirm.textContent = firmName;
            if (succTarget) succTarget.textContent = targetName;
            if (succService) succService.textContent = serviceText;
            if (succSpeed) succSpeed.textContent = speedText;
            if (succTotal) succTotal.textContent = `$${finalAmt.toFixed(2)}`;

            // Show Success screen
            requestForm.classList.add('d-none');
            successView?.classList.remove('d-none');
            
            // Scroll to form container
            successView?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }

    // ==========================================
    // Aegis 3D Effects & PREMIUM ANIMATIONS
    // ==========================================

    // 1. Scroll Reveal Observer
    const revealElements = document.querySelectorAll('[data-aos]');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // 2. 3D Interactive Card Tilt Effect
    const tiltElements = document.querySelectorAll('.custom-card, .dark-card, .light-card, .calc-card-option, .hero-image-frame, .method-visual-wrapper');
    
    tiltElements.forEach(card => {
        // Only run on non-touch devices
        if (window.matchMedia('(pointer: fine)').matches) {
            // Check if tilt-shine already exists, if not create it
            let shine = card.querySelector('.tilt-shine');
            if (!shine) {
                shine = document.createElement('div');
                shine.className = 'tilt-shine';
                card.appendChild(shine);
            }

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const maxTilt = 8; // gentle, premium tilt
                const rotateX = ((centerY - y) / centerY) * maxTilt;
                const rotateY = ((x - centerX) / centerX) * maxTilt;

                card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
                
                const shineX = (x / rect.width) * 100;
                const shineY = (y / rect.height) * 100;
                card.style.setProperty('--shine-x', `${shineX}%`);
                card.style.setProperty('--shine-y', `${shineY}%`);
                shine.style.opacity = '1';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
                shine.style.opacity = '0';
            });
        }
    });

    // 3. 3D Connection Particle Canvas Engine
    const particleCanvases = document.querySelectorAll('.particles-canvas');
    
    particleCanvases.forEach(canvas => {
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        
        let width = canvas.offsetWidth;
        let height = canvas.offsetHeight;
        canvas.width = width;
        canvas.height = height;

        const maxParticles = 60;
        const particleCount = Math.min(maxParticles, Math.floor((width * height) / 12000));
        const particles = [];
        const connectionDistance = 110;
        
        let mouse = { x: null, y: null, active: false };

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.z = Math.random() * 1.5 + 0.5; // Depth multiplier
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.radius = Math.random() * 1.8 + 0.8;
            }

            update() {
                this.x += this.vx * this.z;
                this.y += this.vy * this.z;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                if (mouse.active && mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 180) {
                        const force = (180 - dist) / 4500;
                        this.x += (dx / dist) * force * this.z;
                        this.y += (dy / dist) * force * this.z;
                    }
                }
            }

            draw() {
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                const color = isDark ? 'rgba(212, 175, 55, 0.35)' : 'rgba(197, 160, 89, 0.3)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius * this.z, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();
            }
        }

        function init() {
            particles.length = 0;
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const lineColorBase = isDark ? '212, 175, 55' : '197, 160, 89';

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const p1 = particles[i];
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        const alpha = (1 - dist / connectionDistance) * 0.12 * Math.min(p1.z, p2.z);
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(${lineColorBase}, ${alpha})`;
                        ctx.lineWidth = 0.7 * Math.min(p1.z, p2.z);
                        ctx.stroke();
                    }
                }

                if (mouse.active && mouse.x !== null && mouse.y !== null) {
                    const p = particles[i];
                    const dx = p.x - mouse.x;
                    const dy = p.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 140) {
                        const alpha = (1 - dist / 140) * 0.18 * p.z;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.strokeStyle = `rgba(${lineColorBase}, ${alpha})`;
                        ctx.lineWidth = 0.7 * p.z;
                        ctx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        }

        init();
        animate();

        const parent = canvas.parentElement;
        parent.addEventListener('mousemove', (e) => {
            const rect = parent.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
            mouse.active = true;
        });

        parent.addEventListener('mouseleave', () => {
            mouse.active = false;
            mouse.x = null;
            mouse.y = null;
        });

        window.addEventListener('resize', () => {
            if (canvas.offsetWidth !== width || canvas.offsetHeight !== height) {
                width = canvas.offsetWidth;
                height = canvas.offsetHeight;
                canvas.width = width;
                canvas.height = height;
                init();
            }
        });
    });

    // 4. Custom 3D Cursor Follower
    if (window.matchMedia('(pointer: fine)').matches) {
        document.body.classList.add('use-custom-cursor');

        const cursorDot = document.createElement('div');
        const cursorRing = document.createElement('div');
        
        cursorDot.className = 'custom-cursor-dot';
        cursorRing.className = 'custom-cursor-ring';
        
        document.body.appendChild(cursorDot);
        document.body.appendChild(cursorRing);

        let mouseX = -100, mouseY = -100;
        let ringX = -100, ringY = -100;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        const renderCursor = () => {
            const ease = 0.15;
            ringX += (mouseX - ringX) * ease;
            ringY += (mouseY - ringY) * ease;
            
            cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate3d(-50%, -50%, 0)`;
            
            requestAnimationFrame(renderCursor);
        };
        renderCursor();

        const updateHoverState = (hovering) => {
            if (hovering) {
                document.body.classList.add('custom-cursor-active');
            } else {
                document.body.classList.remove('custom-cursor-active');
            }
        };

        const attachCursorHoverListeners = () => {
            const interactiveSelectors = 'a, button, .btn, input, select, textarea, .calc-card-option, .uploaded-file-item, .remove-file-btn, #dark-mode-toggle, #rtl-toggle';
            document.querySelectorAll(interactiveSelectors).forEach(el => {
                // Ensure duplicate listeners aren't bound
                el.removeEventListener('mouseenter', enterHandler);
                el.removeEventListener('mouseleave', leaveHandler);
                el.addEventListener('mouseenter', enterHandler);
                el.addEventListener('mouseleave', leaveHandler);
            });
        };

        function enterHandler() { updateHoverState(true); }
        function leaveHandler() { updateHoverState(false); }
        
        attachCursorHoverListeners();

        const cursorObserver = new MutationObserver(() => {
            attachCursorHoverListeners();
        });
        cursorObserver.observe(document.body, { childList: true, subtree: true });
    }
});
