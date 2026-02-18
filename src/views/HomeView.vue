<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const features = [
  {
    icon: '💡',
    title: 'Save Project Ideas',
    description: 'Never lose a brilliant idea. Store all your project concepts in one organized place.'
  },
  {
    icon: '🗺️',
    title: 'Feature Roadmap',
    description: 'Plan your development journey with structured roadmaps and milestones.'
  },
  {
    icon: '📅',
    title: 'Timeline Planning',
    description: 'Set goals, deadlines, and track progress across all your projects.'
  },
  {
    icon: '🔒',
    title: 'Secure Notes',
    description: 'Keep your technical notes, code snippets, and documentation safe and accessible.'
  },
  {
    icon: '📊',
    title: 'Progress Monitoring',
    description: 'Visualize your development progress and stay motivated with clear metrics.'
  },
  {
    icon: '🎯',
    title: 'Goal Tracking',
    description: 'Set clear objectives and monitor completion status across all projects.'
  }
]

const workflowSteps = [
  { icon: '💭', label: 'Idea', color: '#667eea' },
  { icon: '📝', label: 'Plan', color: '#764ba2' },
  { icon: '⚡', label: 'Build', color: '#f093fb' },
  { icon: '✅', label: 'Track', color: '#4facfe' }
]

const createProject = () => {
  router.push('/register')
}

const viewNotes = () => {
  router.push('/login')
}
</script>

<template>
  <div class="homepage">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">Project Manager</h1>
        <p class="hero-tagline">Your Personal Developer Productivity Hub</p>
        <p class="hero-description">
          Track project ideas, roadmaps, planned features, and development progress.
          Never forget your workflow or vision again.
        </p>
        <div class="hero-actions">
          <button class="btn btn-primary" @click="createProject">
            <span class="btn-icon">🚀</span>
            Create New Project
          </button>
          <button class="btn btn-secondary" @click="viewNotes">
            <span class="btn-icon">📋</span>
            View My Notes
          </button>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="section-header">
        <h2 class="section-title">Powerful Features for Developers</h2>
        <p class="section-subtitle">Everything you need to stay organized and productive</p>
      </div>
      <div class="features-grid">
        <div v-for="(feature, index) in features" :key="index" class="feature-card">
          <div class="feature-icon">{{ feature.icon }}</div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-description">{{ feature.description }}</p>
        </div>
      </div>
    </section>

    <!-- Workflow Section -->
    <section class="workflow-section">
      <div class="section-header">
        <h2 class="section-title">Simple Workflow</h2>
        <p class="section-subtitle">From idea to completion in four clear steps</p>
      </div>
      <div class="workflow-steps">
        <div v-for="(step, index) in workflowSteps" :key="index" class="workflow-step">
          <div class="workflow-icon" :style="{ borderColor: step.color }">
            <span>{{ step.icon }}</span>
          </div>
          <p class="workflow-label" :style="{ color: step.color }">{{ step.label }}</p>
          <div v-if="index < workflowSteps.length - 1" class="workflow-arrow">→</div>
        </div>
      </div>
    </section>

    <!-- Dashboard Preview -->
    <section class="preview-section">
      <div class="section-header">
        <h2 class="section-title">Your Development Dashboard</h2>
        <p class="section-subtitle">Clean interface designed for focused productivity</p>
      </div>
      <div class="preview-container">
        <div class="preview-panel preview-projects">
          <div class="preview-header">
            <h4>Active Projects</h4>
            <span class="badge">3</span>
          </div>
          <div class="preview-item">
            <div class="preview-status status-active"></div>
            <div class="preview-text">
              <strong>E-commerce Platform</strong>
              <span>75% complete</span>
            </div>
          </div>
          <div class="preview-item">
            <div class="preview-status status-planning"></div>
            <div class="preview-text">
              <strong>Mobile App Redesign</strong>
              <span>Planning phase</span>
            </div>
          </div>
          <div class="preview-item">
            <div class="preview-status status-active"></div>
            <div class="preview-text">
              <strong>API Integration</strong>
              <span>60% complete</span>
            </div>
          </div>
        </div>
        <div class="preview-panel preview-notes">
          <div class="preview-header">
            <h4>Recent Notes</h4>
            <span class="badge">12</span>
          </div>
          <div class="preview-note">
            <span class="note-tag tag-idea">Idea</span>
            <p>Implement real-time collaboration feature...</p>
          </div>
          <div class="preview-note">
            <span class="note-tag tag-bug">Bug Fix</span>
            <p>Resolve authentication token expiration...</p>
          </div>
          <div class="preview-note">
            <span class="note-tag tag-feature">Feature</span>
            <p>Add dark mode toggle to settings panel...</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Motivation Section -->
    <section class="motivation-section">
      <div class="motivation-content">
        <div class="motivation-icon">🎯</div>
        <h2 class="motivation-title">Build Better, Ship Faster</h2>
        <p class="motivation-text">
          Great projects start with clear thinking. Keep your ideas organized,
          track your progress, and turn your vision into reality—one feature at a time.
        </p>
        <button class="btn btn-accent" @click="createProject">
          Get Started Today
        </button>
      </div>
    </section>

    <!-- Footer -->
    <footer class="homepage-footer">
      <div class="footer-content">
        <p>&copy; 2026 Project Manager. Built for developers who ship.</p>
        <div class="footer-links">
          <a href="#">About</a>
          <a href="#">Documentation</a>
          <a href="#">Support</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.homepage {
  width: 100%;
  min-height: 100vh;
}

/* Hero Section */
.hero-section {
  padding: 80px 20px;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
  line-height: 1.2;
}

.hero-tagline {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 20px;
  opacity: 0.9;
}

.hero-description {
  font-size: 1.125rem;
  line-height: 1.7;
  margin-bottom: 40px;
  opacity: 0.8;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 14px 32px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-icon {
  font-size: 1.2rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.btn-secondary {
  background: transparent;
  color: inherit;
  border: 2px solid rgba(102, 126, 234, 0.3);
}

.btn-secondary:hover {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

/* Features Section */
.features-section {
  padding: 80px 20px;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 12px;
}

.section-subtitle {
  font-size: 1.125rem;
  opacity: 0.7;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  padding: 32px;
  border-radius: 16px;
  border: 1px solid rgba(102, 126, 234, 0.2);
  transition: all 0.3s ease;
  text-align: center;
}

.feature-card:hover {
  transform: translateY(-5px);
  border-color: #667eea;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 12px;
}

.feature-description {
  font-size: 0.95rem;
  line-height: 1.6;
  opacity: 0.7;
}

/* Workflow Section */
.workflow-section {
  padding: 80px 20px;
}

.workflow-steps {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  max-width: 900px;
  margin: 0 auto;
}

.workflow-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.workflow-icon {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  margin-bottom: 12px;
  transition: transform 0.3s ease;
}

.workflow-icon:hover {
  transform: scale(1.1);
}

.workflow-label {
  font-size: 1.125rem;
  font-weight: 600;
}

.workflow-arrow {
  font-size: 2rem;
  color: #667eea;
  margin: 0 20px;
  align-self: center;
}

/* Preview Section */
.preview-section {
  padding: 80px 20px;
}

.preview-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.preview-panel {
  padding: 24px;
  border-radius: 16px;
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(102, 126, 234, 0.2);
}

.preview-header h4 {
  font-size: 1.125rem;
  font-weight: 600;
}

.badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
}

.preview-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: background 0.2s ease;
}

.preview-item:hover {
  background: rgba(102, 126, 234, 0.05);
}

.preview-status {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.status-active {
  background: #4facfe;
  box-shadow: 0 0 8px rgba(79, 172, 254, 0.5);
}

.status-planning {
  background: #f093fb;
  box-shadow: 0 0 8px rgba(240, 147, 251, 0.5);
}

.preview-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.preview-text strong {
  font-size: 0.95rem;
}

.preview-text span {
  font-size: 0.85rem;
  opacity: 0.6;
}

.preview-note {
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 12px;
  transition: background 0.2s ease;
}

.preview-note:hover {
  background: rgba(102, 126, 234, 0.05);
}

.note-tag {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.tag-idea {
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
}

.tag-bug {
  background: rgba(244, 67, 54, 0.2);
  color: #f44336;
}

.tag-feature {
  background: rgba(76, 175, 80, 0.2);
  color: #4caf50;
}

.preview-note p {
  font-size: 0.9rem;
  opacity: 0.7;
  line-height: 1.5;
}

/* Motivation Section */
.motivation-section {
  padding: 100px 20px;
  text-align: center;
}

.motivation-content {
  max-width: 700px;
  margin: 0 auto;
}

.motivation-icon {
  font-size: 4rem;
  margin-bottom: 24px;
}

.motivation-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.motivation-text {
  font-size: 1.125rem;
  line-height: 1.8;
  margin-bottom: 40px;
  opacity: 0.8;
}

.btn-accent {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(240, 147, 251, 0.4);
}

.btn-accent:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(240, 147, 251, 0.5);
}

/* Footer */
.homepage-footer {
  padding: 40px 20px;
  border-top: 1px solid rgba(102, 126, 234, 0.2);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.footer-content p {
  opacity: 0.6;
  font-size: 0.9rem;
}

.footer-links {
  display: flex;
  gap: 24px;
}

.footer-links a {
  text-decoration: none;
  opacity: 0.7;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.footer-links a:hover {
  opacity: 1;
  color: #667eea;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-tagline {
    font-size: 1.25rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .hero-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .section-title {
    font-size: 2rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .workflow-steps {
    flex-direction: column;
  }

  .workflow-arrow {
    transform: rotate(90deg);
    margin: 10px 0;
  }

  .preview-container {
    grid-template-columns: 1fr;
  }

  .motivation-title {
    font-size: 2rem;
  }

  .footer-content {
    flex-direction: column;
    text-align: center;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .hero-title {
    font-size: 3rem;
  }

  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .preview-container {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 1025px) {
  .hero-section {
    padding: 120px 20px;
  }

  .features-section,
  .workflow-section,
  .preview-section {
    padding: 100px 20px;
  }

  .features-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .preview-container {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
