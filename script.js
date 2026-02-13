// Mobile menu toggle
const menuToggle = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

/**** Guest Mode ****/
const TRIAL_COUNT_KEY = 'grok_trial_count';
const MAX_FREE_TRIALS = 3;

function getTrialCount() {
    return parseInt(localStorage.getItem(TRIAL_COUNT_KEY) || '0');
}

function updateTrialCountUI() {
    const count = getTrialCount();
    const remaining = MAX_FREE_TRIALS - count;

    // Update trial info if exists
    const trialInfo = document.querySelector('.trial-info');
    if (trialInfo) {
        trialInfo.textContent = remaining > 0
            ? `访客模式：您还可以免费试用 ${remaining} 次`
            : '访客模式：您的免费试用次数已用完';
    }

    // Update guest notice text
    const remainingCountEl = document.querySelector('.remaining-count');
    if (remainingCountEl) {
        remainingCountEl.textContent = remaining > 0 ? remaining : 0;
    }
}

function incrementTrialCount() {
    const count = getTrialCount();
    if (count < MAX_FREE_TRIALS) {
        localStorage.setItem(TRIAL_COUNT_KEY, (count + 1).toString());
        updateTrialCountUI();
        return true;
    }
    return false;
}

// Initialize trial count UI
updateTrialCountUI();

/**** Task Form ****/
const taskForm = document.getElementById('taskForm');
const taskNameInput = document.getElementById('taskName');
const taskScheduleSelect = document.getElementById('schedule');
const taskDescInput = document.getElementById('taskDesc');
const taskPromptInput = document.getElementById('taskPrompt');
const submitBtn = document.getElementById('btnCreate');
const optimizeBtn = document.getElementById('btnOptimize');

// Form validation
function validateForm() {
    if (!taskNameInput || !taskPromptInput) return false;

    const nameValue = taskNameInput.value.trim();
    const promptValue = taskPromptInput.value.trim();

    return nameValue.length > 0 && promptValue.length > 0;
}

// Update submit button state
function updateSubmitButton() {
    if (submitBtn) {
        const isValid = validateForm();
        submitBtn.disabled = !isValid;
    }

    if (optimizeBtn && taskPromptInput) {
        optimizeBtn.disabled = taskPromptInput.value.trim().length === 0;
    }
}

// Input event listeners
if (taskNameInput) taskNameInput.addEventListener('input', updateSubmitButton);
if (taskPromptInput) taskPromptInput.addEventListener('input', updateSubmitButton);

// Initial button state
updateSubmitButton();

// Create new task row HTML
function createTaskRow(task) {
    const div = document.createElement('div');
    div.className = 'task-row fade-in';
    div.innerHTML = `
        <div class="task-row-checkbox">
            <input type="checkbox" class="task-checkbox-input" />
        </div>
        <div class="task-row-content">
            <h3 class="task-name">${task.name}</h3>
            <p class="task-desc">${task.desc || '无描述'}</p>
        </div>
        <span class="task-status active">进行中</span>
        <span class="task-cron">${task.schedule}</span>
        <div class="task-actions">
            <button class="btn btn-execute" title="游客模式：消耗 1 次免费体验">执行</button>
            <button class="btn btn-edit">编辑</button>
            <button class="btn btn-history">历史</button>
            <button class="btn btn-share">分享</button>
            <button class="btn btn-more">⋮</button>
        </div>
    `;

    // Add event listeners to new buttons
    const execBtn = div.querySelector('.btn-execute');
    if (execBtn) {
        execBtn.addEventListener('click', handleExecuteTask);
    }

    return div;
}

function handleExecuteTask(e) {
    e.preventDefault();
    const canSubmit = incrementTrialCount();
    if (!canSubmit) {
        alert('您的免费试用次数已用完，请登录后继续使用');
        return;
    }

    const btn = e.currentTarget;
    const row = btn.closest('.task-row');
    const name = row ? row.querySelector('.task-name').textContent : '未知任务';

    const originalText = btn.textContent;
    btn.textContent = '执行中...';
    btn.disabled = true;

    setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        alert(`任务 "${name}" 执行成功！结果已发送至您的邮箱。`);
    }, 1500);
}

// Form submission
if (taskForm) {
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Check trial count for guest users
        const canSubmit = incrementTrialCount();
        if (!canSubmit) {
            alert('您的免费试用次数已用完，请登录后继续使用');
            return;
        }

        // Simulate task creation
        const taskData = {
            name: taskNameInput.value.trim(),
            schedule: taskScheduleSelect.options[taskScheduleSelect.selectedIndex].text.split(' ')[0],
            desc: taskDescInput.value.trim(),
            prompt: taskPromptInput.value.trim(),
            timestamp: new Date().toISOString()
        };

        // Show loading state
        const loadingIndicator = document.getElementById('loadingIndicator');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'block';
            taskForm.style.opacity = '0.5';
        }

        setTimeout(() => {
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
                taskForm.style.opacity = '1';
            }

            // Add to list
            const taskList = document.querySelector('.task-list');
            if (taskList) {
                const newRow = createTaskRow(taskData);
                if (taskList.firstChild) {
                    taskList.insertBefore(newRow, taskList.firstChild);
                } else {
                    taskList.appendChild(newRow);
                }

                // Update count
                const summaryCount = document.querySelector('.task-status-summary strong:nth-child(2)');
                if (summaryCount) {
                     // update active count logic if needed
                }
            }

            console.log('任务已创建:', taskData);

            // Reset form
            taskForm.reset();
            updateSubmitButton();

            // Show success message
            alert('任务创建成功！');
        }, 1000);
    });
}

// Bind existing execute buttons
document.querySelectorAll('.btn-execute').forEach(btn => {
    btn.addEventListener('click', handleExecuteTask);
});

/**** Pricing Toggle ****/
const billingInputs = document.querySelectorAll('input[name="billing"]');

const prices = {
    'one-time': { starter: 15, standard: 49, pro: 129, period: '一次性' },
    'monthly': { starter: 5, standard: 15, pro: 39, period: '/月' },
    'quarterly': { starter: 13.5, standard: 40.5, pro: 105, period: '/季' },
    'yearly': { starter: 49, standard: 149, pro: 399, period: '/年' }
};

if (billingInputs.length > 0) {
    billingInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            const plan = e.target.value;
            const currentPrices = prices[plan];

            document.querySelectorAll('.pricing-card').forEach(card => {
                const amountEl = card.querySelector('.price-amount');
                const periodEl = card.querySelector('.price-period');

                if (!amountEl) return;

                if (card.classList.contains('starter') || card.querySelector('.pricing-title')?.textContent.includes('入门')) {
                    amountEl.textContent = '¥' + currentPrices.starter;
                } else if (card.classList.contains('standard') || card.querySelector('.pricing-title')?.textContent.includes('标准')) {
                    amountEl.textContent = '¥' + currentPrices.standard;
                } else if (card.classList.contains('pro') || card.querySelector('.pricing-title')?.textContent.includes('专业')) {
                    amountEl.textContent = '¥' + currentPrices.pro;
                }

                if (periodEl && !card.classList.contains('free') && !card.classList.contains('enterprise')) {
                    periodEl.textContent = currentPrices.period;
                }
            });
        });
    });
}

/**** FAQ Accordion ****/
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    if (question) {
        question.addEventListener('click', () => {
            // Close other open items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    }
});

/**** Showcase Loading ****/
const showcaseLoading = document.getElementById('showcaseLoading');
const showcaseGrid = document.getElementById('showcaseGrid');

if (showcaseLoading && showcaseGrid) {
    // Hide grid initially
    showcaseGrid.style.display = 'none';

    // Simulate loading
    setTimeout(() => {
        showcaseLoading.style.display = 'none';
        showcaseGrid.style.display = 'grid';

        // Trigger simple fade in
        showcaseGrid.style.opacity = '0';
        showcaseGrid.style.transition = 'opacity 0.5s ease';

        // Force reflow
        void showcaseGrid.offsetWidth;

        showcaseGrid.style.opacity = '1';

    }, 800);
}


const editButtons = document.querySelectorAll('.btn-edit');

editButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const card = btn.closest('.task-card');
        const title = card?.querySelector('.task-title')?.textContent;
        console.log('编辑任务:', title);
        alert('编辑功能开发中...');
    });
});

const historyButtons = document.querySelectorAll('.btn-history');

historyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const card = btn.closest('.task-card');
        const title = card?.querySelector('.task-title')?.textContent;
        console.log('查看历史:', title);
        alert('历史记录功能开发中...');
    });
});

/**** Pagination ****/
const pageButtons = document.querySelectorAll('.page-btn:not(.disabled)');

pageButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const pageBtn = e.target.closest('.page-btn');
        if (!pageBtn.classList.contains('disabled')) {
            const page = pageBtn.dataset.page;
            console.log('切换到第', page, '页');
            // Pagination logic would go here
        }
    });
});

/**** Smooth scroll for navigation links ****/
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/**** Header scroll effect ****/
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (header) {
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    lastScroll = currentScroll;
});

/**** Intersection Observer for animations ****/
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe sections for animation
document.querySelectorAll('.features, .why-choose, .pricing, .faq').forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
});

console.log('GrokXNews - JavaScript initialized');
