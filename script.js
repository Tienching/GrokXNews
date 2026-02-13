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
    if (execBtn) execBtn.addEventListener('click', handleExecuteTask);
    const editBtn = div.querySelector('.btn-edit');
    if (editBtn) editBtn.addEventListener('click', handleEditTask);
    const histBtn = div.querySelector('.btn-history');
    if (histBtn) histBtn.addEventListener('click', handleHistoryTask);
    const shareBtn = div.querySelector('.btn-share');
    if (shareBtn) shareBtn.addEventListener('click', handleShareTask);
    const moreBtn = div.querySelector('.btn-more');
    if (moreBtn) moreBtn.addEventListener('click', handleMoreTask);

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


function handleEditTask(e) {
    e.preventDefault();
    const row = e.currentTarget.closest('.task-row');
    const title = row?.querySelector('.task-name')?.textContent || '未知任务';
    console.log('编辑任务:', title);
    alert(`编辑功能开发中...\n任务：${title}`);
}

function handleHistoryTask(e) {
    e.preventDefault();
    const row = e.currentTarget.closest('.task-row');
    const title = row?.querySelector('.task-name')?.textContent || '未知任务';
    console.log('查看历史:', title);
    alert(`历史记录功能开发中...\n任务：${title}`);
}

function handleShareTask(e) {
    e.preventDefault();
    const row = e.currentTarget.closest('.task-row');
    const title = row?.querySelector('.task-name')?.textContent || '未知任务';
    console.log('分享任务:', title);
    alert(`分享功能开发中...\n任务：${title}`);
}

function handleMoreTask(e) {
    e.preventDefault();
    const row = e.currentTarget.closest('.task-row');
    const title = row?.querySelector('.task-name')?.textContent || '未知任务';
    console.log('更多操作:', title);
    alert(`更多操作开发中...\n任务：${title}`);
}

document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', handleEditTask);
});

document.querySelectorAll('.btn-history').forEach(btn => {
    btn.addEventListener('click', handleHistoryTask);
});

document.querySelectorAll('.btn-share').forEach(btn => {
    btn.addEventListener('click', handleShareTask);
});

document.querySelectorAll('.btn-more').forEach(btn => {
    btn.addEventListener('click', handleMoreTask);
});

/**** Smooth scroll for navigation links ****/
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Handle bare "#" placeholder links
        if (href === '#') {
            e.preventDefault();
            alert('该功能正在开发中，敬请期待！');
            return;
        }

        // Handle pricing anchor links (no matching target on page)
        if (href.startsWith('#order-') || href === '#contact-sales') {
            e.preventDefault();
            if (href === '#contact-sales') {
                window.location.href = '/zh/contact.html';
            } else {
                alert('购买功能即将上线，敬请期待！\n您也可以访问 grokx.news 进行购买。');
            }
            return;
        }

        // Normal smooth scroll for valid section anchors
        e.preventDefault();
        const target = document.querySelector(href);
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

/**** Toolbar Buttons ****/
const refreshBtn = document.getElementById('refreshBtn');
if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
        refreshBtn.textContent = '刷新中...';
        refreshBtn.disabled = true;
        setTimeout(() => {
            refreshBtn.textContent = '刷新任务列表';
            refreshBtn.disabled = false;
            alert('任务列表已刷新');
        }, 800);
    });
}

const notificationBtn = document.getElementById('notificationBtn');
if (notificationBtn) {
    notificationBtn.addEventListener('click', () => {
        alert('通知设置功能开发中...');
    });
}

/**** Form Bottom Actions ****/
document.querySelectorAll('.form-bottom-actions .btn').forEach(btn => {
    const text = btn.textContent.trim();
    if (text === '使用模板') {
        btn.addEventListener('click', () => {
            alert('任务模板功能开发中...\n即将推出丰富的预设模板，敬请期待！');
        });
    } else if (text === '高级选项') {
        btn.addEventListener('click', () => {
            alert('高级选项功能开发中...\n即将支持自定义 Cron 表达式、多邮箱推送等高级功能。');
        });
    }
});

/**** AI Optimize Button ****/
if (optimizeBtn) {
    optimizeBtn.addEventListener('click', () => {
        if (!taskPromptInput || taskPromptInput.value.trim().length === 0) return;
        const originalText = optimizeBtn.textContent;
        optimizeBtn.textContent = '优化中...';
        optimizeBtn.disabled = true;
        setTimeout(() => {
            optimizeBtn.textContent = originalText;
            optimizeBtn.disabled = false;
            alert('AI 提示词优化功能开发中...\n即将接入 Grok AI 优化您的提示词。');
        }, 1000);
    });
}

/**** Select All Tasks ****/
const selectAllCheckbox = document.getElementById('selectAllTasks');
if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', (e) => {
        const checked = e.target.checked;
        document.querySelectorAll('.task-checkbox-input').forEach(cb => {
            cb.checked = checked;
        });
    });
}

/**** Search Box ****/
const taskSearchInput = document.getElementById('taskSearch');
if (taskSearchInput) {
    taskSearchInput.addEventListener('input', (e) => {
        const keyword = e.target.value.trim().toLowerCase();
        document.querySelectorAll('.task-row').forEach(row => {
            const name = row.querySelector('.task-name')?.textContent.toLowerCase() || '';
            const desc = row.querySelector('.task-desc')?.textContent.toLowerCase() || '';
            if (keyword === '' || name.includes(keyword) || desc.includes(keyword)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
}

/**** Filter Selects ****/
const statusFilter = document.getElementById('statusFilter');
if (statusFilter) {
    statusFilter.addEventListener('change', (e) => {
        const val = e.target.value;
        document.querySelectorAll('.task-row').forEach(row => {
            const statusEl = row.querySelector('.task-status');
            if (!val) {
                row.style.display = '';
                return;
            }
            if (statusEl && statusEl.classList.contains(val)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
}

const sortFilter = document.getElementById('sortFilter');
if (sortFilter) {
    sortFilter.addEventListener('change', (e) => {
        const val = e.target.value;
        const taskList = document.querySelector('.task-list');
        if (!taskList) return;
        const rows = Array.from(taskList.querySelectorAll('.task-row'));
        rows.sort((a, b) => {
            if (val === 'name') {
                const nameA = a.querySelector('.task-name')?.textContent || '';
                const nameB = b.querySelector('.task-name')?.textContent || '';
                return nameA.localeCompare(nameB, 'zh');
            }
            if (val === 'schedule') {
                const cronA = a.querySelector('.task-cron')?.textContent || '';
                const cronB = b.querySelector('.task-cron')?.textContent || '';
                return cronA.localeCompare(cronB);
            }
            return 0;
        });
        rows.forEach(row => taskList.appendChild(row));
    });
}

/**** Pagination Buttons ****/
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');

if (prevPageBtn) {
    prevPageBtn.addEventListener('click', () => {
        if (prevPageBtn.disabled) return;
        alert('上一页功能开发中...');
    });
}

if (nextPageBtn) {
    nextPageBtn.addEventListener('click', () => {
        if (nextPageBtn.disabled) return;
        alert('下一页功能开发中...');
    });
}

const itemsPerPageSelect = document.getElementById('itemsPerPage');
if (itemsPerPageSelect) {
    itemsPerPageSelect.addEventListener('change', (e) => {
        console.log('每页显示:', e.target.value, '条');
    });
}

// Observe sections for animation
document.querySelectorAll('.features, .why-choose, .pricing, .faq').forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
});

console.log('GrokXNews - JavaScript initialized');
