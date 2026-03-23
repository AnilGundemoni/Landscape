(() => {
	const roleButtons = document.querySelectorAll('.role-btn');
	const userView = document.getElementById('userView');
	const adminView = document.getElementById('adminView');

	if (!roleButtons.length || !userView || !adminView) {
		return;
	}

	const userBookings = [
		{ id: 'BK-1024', service: 'Lawn Maintenance', date: 'Mar 21, 2026 · 09:00 AM', crew: 'Crew A2', status: 'confirmed' },
		{ id: 'BK-1039', service: 'Spring Planting', date: 'Mar 25, 2026 · 08:30 AM', crew: 'Crew C1', status: 'pending' },
		{ id: 'BK-1060', service: 'Irrigation Check', date: 'Mar 28, 2026 · 11:00 AM', crew: 'Crew B1', status: 'confirmed' }
	];

	const userJobs = [
		{ title: 'Snow removal - Maple St', subtitle: 'Crew B2 dispatched, ETA 18 min', status: 'in-progress' },
		{ title: 'Driveway salting - Pine Ave', subtitle: 'Salt spread complete, inspection pending', status: 'pending' },
		{ title: 'Front garden refresh', subtitle: 'Plant delivery scheduled for tomorrow', status: 'confirmed' }
	];

	const userActivity = [
		{ title: 'Invoice #INV-902 paid', time: '12 min ago' },
		{ title: 'Crew B2 marked job as in progress', time: '35 min ago' },
		{ title: 'Booking BK-1060 confirmed', time: '2 hours ago' }
	];

	const adminDispatch = [
		{ job: 'JOB-7841', client: 'City Plaza', service: 'Snow Plow + Salt', priority: 'Critical', status: 'progress' },
		{ job: 'JOB-7842', client: 'Lakeview HOA', service: 'Lawn Maintenance', priority: 'Normal', status: 'pending' },
		{ job: 'JOB-7843', client: 'West Ridge Mall', service: 'Retaining Wall Repair', priority: 'High', status: 'overdue' },
		{ job: 'JOB-7844', client: 'Evergreen Villas', service: 'Irrigation Diagnostics', priority: 'Normal', status: 'confirmed' }
	];

	const adminInventory = [
		{ title: 'Rock Salt', subtitle: '42 bags left · reorder point: 30', status: 'confirmed' },
		{ title: 'Truck #05', subtitle: 'Scheduled maintenance due in 3 days', status: 'pending' },
		{ title: 'Mini Excavator', subtitle: 'Available · last inspection passed', status: 'complete' },
		{ title: 'Topsoil', subtitle: 'Low stock at Yard B', status: 'critical' }
	];

	const adminActivity = [
		{ title: 'Dispatch rerouted due to road closure', time: '8 min ago' },
		{ title: 'Crew C1 clocked in for shift', time: '18 min ago' },
		{ title: 'Daily report generated and mailed', time: '1 hour ago' }
	];

	function statusClass(status) {
		if (status === 'in-progress' || status === 'progress') return 'status-progress';
		if (status === 'overdue') return 'status-overdue';
		if (status === 'complete') return 'status-complete';
		if (status === 'critical') return 'status-critical';
		if (status === 'pending') return 'status-pending';
		return 'status-confirmed';
	}

	function statusLabel(status) {
		if (status === 'in-progress') return 'In Progress';
		if (status === 'progress') return 'Dispatched';
		if (status === 'overdue') return 'Overdue';
		if (status === 'complete') return 'Ready';
		if (status === 'critical') return 'Critical';
		if (status === 'pending') return 'Pending';
		return 'Confirmed';
	}

	function renderUserBookings() {
		const tbody = document.getElementById('userBookingRows');
		if (!tbody) return;

		tbody.innerHTML = userBookings.map((row) => {
			return `<tr>
				<td><strong>${row.service}</strong><div style="font-size:11px;color:var(--clr-text-muted)">${row.id}</div></td>
				<td>${row.date}</td>
				<td>${row.crew}</td>
				<td><span class="status-pill ${statusClass(row.status)}">${statusLabel(row.status)}</span></td>
				<td>
					<span class="row-actions">
						<button class="action-btn" data-user-action="reschedule" data-id="${row.id}" type="button">Reschedule</button>
						<button class="action-btn" data-user-action="cancel" data-id="${row.id}" type="button">Cancel</button>
					</span>
				</td>
			</tr>`;
		}).join('');

		tbody.querySelectorAll('[data-user-action]').forEach((btn) => {
			btn.addEventListener('click', () => {
				const action = btn.getAttribute('data-user-action');
				const id = btn.getAttribute('data-id');
				if (action === 'reschedule') {
					pushUserActivity(`Reschedule requested for ${id}`);
					return;
				}
				const index = userBookings.findIndex((item) => item.id === id);
				if (index !== -1) {
					userBookings.splice(index, 1);
					pushUserActivity(`Booking ${id} cancelled by user`);
					renderUserBookings();
					document.getElementById('uBookedCount').textContent = String(userBookings.length);
				}
			});
		});
	}

	function renderUserJobs() {
		const list = document.getElementById('userJobsList');
		if (!list) return;
		list.innerHTML = userJobs.map((job) => {
			return `<article class="dash-mini-item">
				<div><strong>${job.title}</strong><span>${job.subtitle}</span></div>
				<span class="status-pill ${statusClass(job.status)}">${statusLabel(job.status)}</span>
			</article>`;
		}).join('');
	}

	function renderUserActivity() {
		const feed = document.getElementById('userActivityFeed');
		if (!feed) return;
		feed.innerHTML = userActivity.map((item) => {
			return `<article class="activity-item"><strong>${item.title}</strong><span>${item.time}</span></article>`;
		}).join('');
	}

	function pushUserActivity(title) {
		userActivity.unshift({ title, time: 'Just now' });
		if (userActivity.length > 5) userActivity.pop();
		renderUserActivity();
	}

	function renderAdminDispatch() {
		const tbody = document.getElementById('adminDispatchRows');
		if (!tbody) return;

		tbody.innerHTML = adminDispatch.map((row) => {
			return `<tr>
				<td><strong>${row.job}</strong></td>
				<td>${row.client}</td>
				<td>${row.service}</td>
				<td>${row.priority}</td>
				<td><span class="status-pill ${statusClass(row.status)}">${statusLabel(row.status)}</span></td>
				<td>
					<span class="row-actions">
						<button class="action-btn primary" data-admin-action="assign" data-job="${row.job}" type="button">Assign</button>
						<button class="action-btn" data-admin-action="complete" data-job="${row.job}" type="button">Complete</button>
					</span>
				</td>
			</tr>`;
		}).join('');

		tbody.querySelectorAll('[data-admin-action]').forEach((btn) => {
			btn.addEventListener('click', () => {
				const action = btn.getAttribute('data-admin-action');
				const jobId = btn.getAttribute('data-job');
				const job = adminDispatch.find((item) => item.job === jobId);
				if (!job) return;

				if (action === 'assign') {
					job.status = 'progress';
					pushAdminActivity(`Crew assigned to ${jobId}`);
				}
				if (action === 'complete') {
					job.status = 'complete';
					pushAdminActivity(`${jobId} marked complete`);
				}

				renderAdminDispatch();
			});
		});
	}

	function renderAdminInventory() {
		const list = document.getElementById('adminInventoryList');
		if (!list) return;
		list.innerHTML = adminInventory.map((item) => {
			return `<article class="dash-mini-item">
				<div><strong>${item.title}</strong><span>${item.subtitle}</span></div>
				<span class="status-pill ${statusClass(item.status)}">${statusLabel(item.status)}</span>
			</article>`;
		}).join('');
	}

	function renderAdminActivity() {
		const feed = document.getElementById('adminActivityFeed');
		if (!feed) return;
		feed.innerHTML = adminActivity.map((item) => {
			return `<article class="activity-item"><strong>${item.title}</strong><span>${item.time}</span></article>`;
		}).join('');
	}

	function pushAdminActivity(title) {
		adminActivity.unshift({ title, time: 'Just now' });
		if (adminActivity.length > 6) adminActivity.pop();
		renderAdminActivity();
	}

	roleButtons.forEach((btn) => {
		btn.addEventListener('click', () => {
			const role = btn.getAttribute('data-role');
			roleButtons.forEach((x) => x.classList.remove('active'));
			btn.classList.add('active');

			if (role === 'admin') {
				userView.classList.remove('active');
				adminView.classList.add('active');
				return;
			}

			adminView.classList.remove('active');
			userView.classList.add('active');
		});
	});

	const createDispatchBtn = document.getElementById('createDispatchBtn');
	if (createDispatchBtn) {
		createDispatchBtn.addEventListener('click', () => {
			pushAdminActivity('New dispatch draft created for tomorrow morning window');
			document.getElementById('aNewRequests').textContent = '19';
		});
	}

	const syncReportBtn = document.getElementById('syncReportBtn');
	if (syncReportBtn) {
		syncReportBtn.addEventListener('click', () => {
			pushAdminActivity('Daily report synced to management inbox');
			document.getElementById('aRevenue').textContent = '$18.9k';
		});
	}

	renderUserBookings();
	renderUserJobs();
	renderUserActivity();
	renderAdminDispatch();
	renderAdminInventory();
	renderAdminActivity();
})();
