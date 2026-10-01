// BarberFlow - Dynamic Interactivity Script

document.addEventListener('DOMContentLoaded', () => {
    initCountdown();
    initForm();
    initCalculator();
    initFAQ();
    initYear();
});

/* --------------------------------------------------------------------------
   1. Launch Countdown Timer
   -------------------------------------------------------------------------- */
function initCountdown() {
    // Set launch date to 28 days from now
    const launchDate = new Date();
    launchDate.setDate(launchDate.getDate() + 28);
    launchDate.setHours(12, 0, 0, 0);

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    function updateTimer() {
        const now = new Date().getTime();
        const distance = launchDate.getTime() - now;

        if (distance < 0) {
            if (daysEl) daysEl.textContent = '00';
            if (hoursEl) hoursEl.textContent = '00';
            if (minutesEl) minutesEl.textContent = '00';
            if (secondsEl) secondsEl.textContent = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    updateTimer();
    setInterval(updateTimer, 1000);
}

/* --------------------------------------------------------------------------
   2. VIP Form Handling & Validation & Mask
   -------------------------------------------------------------------------- */
function initForm() {
    const form = document.getElementById('vip-form');
    const phoneInput = document.getElementById('phone');
    const successBanner = document.getElementById('form-success');
    const btnReset = document.getElementById('btn-reset');

    // WhatsApp Input Mask: (XX) XXXXX-XXXX
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
            e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
        });
    }

    // Check if already registered in localStorage
    if (localStorage.getItem('barberflow_subscribed') === 'true') {
        if (form && successBanner) {
            form.classList.add('hidden');
            successBanner.classList.remove('hidden');
        }
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const barbershop = document.getElementById('barbershop').value.trim();
            const teamSize = document.getElementById('team-size').value;

            if (!name || !phone || !barbershop || !teamSize) {
                showToast('Por favor, preencha todos os campos.', 'error');
                return;
            }

            // Save lead data locally
            const leadData = {
                name,
                phone,
                barbershop,
                teamSize,
                timestamp: new Date().toISOString()
            };

            localStorage.setItem('barberflow_lead', JSON.stringify(leadData));
            localStorage.setItem('barberflow_subscribed', 'true');

            // Hide form and show success message
            form.classList.add('hidden');
            successBanner.classList.remove('hidden');

            showToast('🎉 Inscrição VIP realizada com sucesso!');
        });
    }

    if (btnReset) {
        btnReset.addEventListener('click', () => {
            localStorage.removeItem('barberflow_subscribed');
            if (form && successBanner) {
                form.reset();
                successBanner.classList.add('hidden');
                form.classList.remove('hidden');
            }
        });
    }
}

/* --------------------------------------------------------------------------
   3. Interactive ROI & Savings Calculator
   -------------------------------------------------------------------------- */
function initCalculator() {
    const sliderClients = document.getElementById('slider-clients');
    const sliderPrice = document.getElementById('slider-price');
    const sliderNoShow = document.getElementById('slider-noshow');

    const clientsVal = document.getElementById('clients-val');
    const priceVal = document.getElementById('price-val');
    const noShowVal = document.getElementById('noshow-val');

    const resMoney = document.getElementById('res-money');
    const resHours = document.getElementById('res-hours');

    function calculate() {
        if (!sliderClients || !sliderPrice || !sliderNoShow) return;

        const clients = parseInt(sliderClients.value, 10);
        const price = parseInt(sliderPrice.value, 10);
        const noShow = parseInt(sliderNoShow.value, 10);

        clientsVal.textContent = `${clients} clientes`;
        priceVal.textContent = `R$ ${price}`;
        noShowVal.textContent = `${noShow} faltas`;

        // Logic: BarberFlow prevents ~80% of no-shows via automated WhatsApp reminders
        // 4 weeks per month * (noShow * 0.8) * price = Monthly saved revenue
        const monthlyRecovered = Math.round(4 * (noShow * 0.8) * price);

        // Logic: 12 minutes saved per appointment booking managed automatically
        // (clients * 4 weeks * 12 min) / 60 = Hours saved per month
        const monthlyHoursSaved = Math.round((clients * 4 * 12) / 60);

        resMoney.textContent = monthlyRecovered.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });

        resHours.textContent = `${monthlyHoursSaved} horas`;
    }

    [sliderClients, sliderPrice, sliderNoShow].forEach(slider => {
        if (slider) {
            slider.addEventListener('input', calculate);
        }
    });

    calculate();
}

/* --------------------------------------------------------------------------
   4. FAQ Accordion
   -------------------------------------------------------------------------- */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        if (questionBtn) {
            questionBtn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all items
                faqItems.forEach(i => i.classList.remove('active'));

                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });
}

/* --------------------------------------------------------------------------
   5. Dynamic Footer Year
   -------------------------------------------------------------------------- */
function initYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}

/* --------------------------------------------------------------------------
   6. Toast Helper
   -------------------------------------------------------------------------- */
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');

    if (toast && toastMsg) {
        toastMsg.textContent = message;
        toast.style.backgroundColor = type === 'error' ? '#ef4444' : '#10b981';
        toast.classList.remove('hidden');

        setTimeout(() => {
            toast.classList.add('hidden');
        }, 4000);
    }
}
