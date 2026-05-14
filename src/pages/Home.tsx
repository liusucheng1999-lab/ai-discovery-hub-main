import { Helmet } from "react-helmet-async";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-animate]"));
    if (elements.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    elements.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const section = document.querySelector<HTMLElement>("#stats");
    if (!section) return;

    const counters = Array.from(section.querySelectorAll<HTMLElement>("[data-count]"));
    if (counters.length === 0) return;

    let started = false;

    const animateCount = (el: HTMLElement, toValueRaw: string) => {
      const toValue = Number(String(toValueRaw).replace(/[^0-9]/g, "")) || 0;
      const hasPlus = String(toValueRaw).includes("+");

      const duration = 2000;
      const start = performance.now();

      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const current = Math.round(toValue * eased);

        const formatted = current.toLocaleString("en-US");
        el.textContent = hasPlus ? `${formatted}+` : formatted;

        if (t < 1) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (started) return;
        const hit = entries.some((e) => e.isIntersecting);
        if (!hit) return;

        started = true;
        counters.forEach((el) => animateCount(el, el.dataset.count || "0"));
        io.disconnect();
      },
      { threshold: 0.3 }
    );

    io.observe(section);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const chips = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-filter-chip]"));
    const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-tool-category]"));
    if (chips.length === 0 || cards.length === 0) return;

    const setActive = (value: string) => {
      chips.forEach((c) => {
        const isActive = c.dataset.filterChip === value;
        c.classList.toggle("is-active", isActive);
        c.setAttribute("aria-pressed", isActive ? "true" : "false");
      });

      cards.forEach((card) => {
        const cat = card.dataset.toolCategory || "";
        const show = value === "all" || cat === value;
        card.style.display = show ? "block" : "none";
      });
    };

    const onClick = (e: Event) => {
      const target = e.target as HTMLElement | null;
      const btn = target?.closest("button[data-filter-chip]") as HTMLButtonElement | null;
      if (!btn) return;
      setActive(btn.dataset.filterChip || "all");
    };

    const container = document.querySelector<HTMLElement>(".am-tool-filter");
    container?.addEventListener("click", onClick);

    setActive("all");

    return () => container?.removeEventListener("click", onClick);
  }, []);

  return (
    <>
      <Helmet>
        <title>AI创客 - 用AI武装自己，从这里开始</title>
        <meta
          name="description"
          content="AI创客，为你精选1000+最好用的AI工具，提供最实用的AI课程，帮助每个人真正用好AI。"
        />
        <link rel="canonical" href="https://aimakerbox.com/" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="https://unpkg.com/lucide-static@0.525.0/font/lucide.css" />
      </Helmet>

      <div className="am-page">
        <main id="top" className="am-main">
          <section className="am-hero">
            <div className="am-hero-bg" aria-hidden="true" />
            <div className="am-container am-hero-inner">
              <div className="am-hero-content">
                <div className="am-pill am-hero-animate" style={{ animationDelay: "0.05s" }}>
                  <span className="am-pill-dot" aria-hidden="true" />
                  持续更新中 · 已收录 1000+ AI工具
                </div>

                <h1 className="am-h1 am-hero-animate" style={{ animationDelay: "0.2s" }}>
                  用 <span className="am-gradient-text">AI</span> 武装自己
                  <br />
                  从这里开始
                </h1>

                <p className="am-subtitle am-hero-animate" style={{ animationDelay: "0.35s" }}>
                  发现最好用的AI工具，学习真正有用的AI技能，用AI做出改变生活的事情。
                </p>

                <div className="am-hero-actions am-hero-animate" style={{ animationDelay: "0.5s" }}>
                  <a className="am-btn am-btn-primary" href="/tools" rel="nofollow">
                    探索AI工具库
                  </a>
                  <a className="am-btn am-btn-secondary" href="/knowledge" rel="nofollow">
                    查看AI课程
                  </a>
                </div>

                <div className="am-hero-metrics am-hero-animate" style={{ animationDelay: "0.65s" }}>
                  <div className="am-metric">已帮助 10,000+ 用户</div>
                  <div className="am-metric-sep" aria-hidden="true" />
                  <div className="am-metric">收录 1000+ AI工具</div>
                  <div className="am-metric-sep" aria-hidden="true" />
                  <div className="am-metric">持续更新中</div>
                </div>
              </div>
            </div>
          </section>

          <section className="am-section am-section-muted" id="value">
            <div className="am-container">
              <div className="am-section-head" data-animate>
                <div className="am-kicker">我们提供什么</div>
                <h2 className="am-h2">一个平台，覆盖你学习和使用AI的全部需求</h2>
                <p className="am-lead">从发现工具，到系统学习，到真实落地，AI创客陪你走完全程</p>
              </div>

              <div className="am-grid-3">
                <article className="am-card" data-animate>
                  <div className="am-card-icon">
                    <i className="lucide lucide-compass" aria-hidden="true" />
                  </div>
                  <h3 className="am-h3">找到真正适合你的AI工具</h3>
                  <p className="am-text">
                    不是所有AI工具都值得用。我们持续测试、筛选、分类，帮你跳过试错成本，直接用最好的。
                  </p>
                  <ul className="am-list">
                    <li>
                      <i className="lucide lucide-check" aria-hidden="true" /> 1000+ 精选工具，分类清晰
                    </li>
                    <li>
                      <i className="lucide lucide-check" aria-hidden="true" /> 每日持续更新
                    </li>
                    <li>
                      <i className="lucide lucide-check" aria-hidden="true" /> 真实使用评测，非商业推广
                    </li>
                  </ul>
                  <a className="am-link" href="/tools" rel="nofollow">
                    探索工具库 →
                  </a>
                  <div className="am-tags">#图像生成 #文字创作 #效率工具 #编程辅助</div>
                </article>

                <article className="am-card am-card-feature" data-animate>
                  <div className="am-card-topbar" aria-hidden="true" />
                  <div className="am-badge-hot">HOT</div>
                  <div className="am-card-icon">
                    <i className="lucide lucide-book-open" aria-hidden="true" />
                  </div>
                  <h3 className="am-h3">学AI，要学真正能用上的</h3>
                  <p className="am-text">
                    没有废话，没有水课。每一节课都围绕"做出来"设计，跟着学完，你能立刻用AI解决实际问题。
                  </p>
                  <ul className="am-list">
                    <li>
                      <i className="lucide lucide-check" aria-hidden="true" /> 视频课程 + 图文教程
                    </li>
                    <li>
                      <i className="lucide lucide-check" aria-hidden="true" /> 实操为主，结果导向
                    </li>
                    <li>
                      <i className="lucide lucide-check" aria-hidden="true" /> 从零基础到能独立完成项目
                    </li>
                  </ul>
                  <a className="am-link" href="/knowledge" rel="nofollow">
                    查看课程 →
                  </a>
                  <div className="am-tags">#AI绘画 #AI写作 #提示词工程 #AI副业</div>
                </article>

                <article className="am-card" data-animate>
                  <div className="am-badge-upcoming">即将上线</div>
                  <div className="am-card-icon">
                    <i className="lucide lucide-hammer" aria-hidden="true" />
                  </div>
                  <h3 className="am-h3">光学不够，要真的做出来</h3>
                  <p className="am-text">
                    用AI完成真实项目。我们提供完整的思路、工具链和执行方案，让你从"学过"变成"做过"。
                  </p>
                  <ul className="am-list">
                    <li>
                      <i className="lucide lucide-check" aria-hidden="true" /> 真实场景，完整项目
                    </li>
                    <li>
                      <i className="lucide lucide-check" aria-hidden="true" /> 工具链 + 执行方案全公开
                    </li>
                    <li>
                      <i className="lucide lucide-check" aria-hidden="true" /> 可直接复用的AI工作流
                    </li>
                  </ul>
                  <span className="am-link am-link-disabled">了解更多 →</span>
                  <div className="am-tags">#AI工作流 #副业项目 #效率提升</div>
                </article>
              </div>
            </div>
          </section>

          <section className="am-section" id="tools">
            <div className="am-container">
              <div className="am-section-head am-section-head-row" data-animate>
                <div>
                  <div className="am-kicker">精选工具</div>
                  <h2 className="am-h2">每一个都经过真实使用</h2>
                  <p className="am-lead">不推没用的，只推真正值得花时间的</p>
                </div>
                <a className="am-link" href="/tools" rel="nofollow">
                  查看全部 1000+ →
                </a>
              </div>

              <div className="am-tool-filter" data-animate>
                <button className="am-chip is-active" data-filter-chip="all" aria-pressed="true" type="button">
                  全部
                </button>
                <button className="am-chip" data-filter-chip="img" aria-pressed="false" type="button">
                  图像生成
                </button>
                <button className="am-chip" data-filter-chip="writing" aria-pressed="false" type="button">
                  文字写作
                </button>
                <button className="am-chip" data-filter-chip="dev" aria-pressed="false" type="button">
                  编程开发
                </button>
                <button className="am-chip" data-filter-chip="video" aria-pressed="false" type="button">
                  视频创作
                </button>
                <button className="am-chip" data-filter-chip="product" aria-pressed="false" type="button">
                  效率工具
                </button>
                <button className="am-chip" data-filter-chip="biz" aria-pressed="false" type="button">
                  商业办公
                </button>
              </div>

              <div className="am-tool-grid" data-animate>
                <a className="am-tool-card" data-tool-category="writing" href="https://chat.openai.com/" target="_blank" rel="noopener noreferrer">
                  <div className="am-tool-top">
                    <div className="am-tool-logo">🤖</div>
                    <div>
                      <div className="am-tool-name">ChatGPT</div>
                      <div className="am-tool-pill">文字写作</div>
                    </div>
                  </div>
                  <div className="am-tool-desc">AI对话/写作首选</div>
                  <div className="am-tool-foot">
                    <div className="am-stars">★ ★ ★ ★ ★</div>
                    <span className="am-tool-link">去使用 →</span>
                  </div>
                </a>

                <a className="am-tool-card" data-tool-category="img" href="https://www.midjourney.com/" target="_blank" rel="noopener noreferrer">
                  <div className="am-tool-top">
                    <div className="am-tool-logo">🎨</div>
                    <div>
                      <div className="am-tool-name">Midjourney</div>
                      <div className="am-tool-pill">图像生成</div>
                    </div>
                  </div>
                  <div className="am-tool-desc">AI图像生成领域标杆</div>
                  <div className="am-tool-foot">
                    <div className="am-stars">★ ★ ★ ★ ★</div>
                    <span className="am-tool-link">去使用 →</span>
                  </div>
                </a>

                <a className="am-tool-card" data-tool-category="writing" href="https://claude.ai/" target="_blank" rel="noopener noreferrer">
                  <div className="am-tool-top">
                    <div className="am-tool-logo">🧠</div>
                    <div>
                      <div className="am-tool-name">Claude</div>
                      <div className="am-tool-pill">文字写作</div>
                    </div>
                  </div>
                  <div className="am-tool-desc">长文处理和分析能力强</div>
                  <div className="am-tool-foot">
                    <div className="am-stars">★ ★ ★ ★ ★</div>
                    <span className="am-tool-link">去使用 →</span>
                  </div>
                </a>

                <a className="am-tool-card" data-tool-category="video" href="https://runwayml.com/" target="_blank" rel="noopener noreferrer">
                  <div className="am-tool-top">
                    <div className="am-tool-logo">🎬</div>
                    <div>
                      <div className="am-tool-name">Runway</div>
                      <div className="am-tool-pill">视频创作</div>
                    </div>
                  </div>
                  <div className="am-tool-desc">AI视频生成工具</div>
                  <div className="am-tool-foot">
                    <div className="am-stars">★ ★ ★ ★ ★</div>
                    <span className="am-tool-link">去使用 →</span>
                  </div>
                </a>

                <a className="am-tool-card" data-tool-category="dev" href="https://www.cursor.com/" target="_blank" rel="noopener noreferrer">
                  <div className="am-tool-top">
                    <div className="am-tool-logo">⌨️</div>
                    <div>
                      <div className="am-tool-name">Cursor</div>
                      <div className="am-tool-pill">编程开发</div>
                    </div>
                  </div>
                  <div className="am-tool-desc">AI编程辅助，效率提升10倍</div>
                  <div className="am-tool-foot">
                    <div className="am-stars">★ ★ ★ ★ ★</div>
                    <span className="am-tool-link">去使用 →</span>
                  </div>
                </a>

                <a className="am-tool-card" data-tool-category="product" href="https://www.notion.so/product/ai" target="_blank" rel="noopener noreferrer">
                  <div className="am-tool-top">
                    <div className="am-tool-logo">📝</div>
                    <div>
                      <div className="am-tool-name">Notion AI</div>
                      <div className="am-tool-pill">效率工具</div>
                    </div>
                  </div>
                  <div className="am-tool-desc">知识管理+AI结合</div>
                  <div className="am-tool-foot">
                    <div className="am-stars">★ ★ ★ ★ ★</div>
                    <span className="am-tool-link">去使用 →</span>
                  </div>
                </a>

                <a className="am-tool-card" data-tool-category="product" href="https://suno.com/" target="_blank" rel="noopener noreferrer">
                  <div className="am-tool-top">
                    <div className="am-tool-logo">🎵</div>
                    <div>
                      <div className="am-tool-name">Suno</div>
                      <div className="am-tool-pill">创意工具</div>
                    </div>
                  </div>
                  <div className="am-tool-desc">AI音乐生成</div>
                  <div className="am-tool-foot">
                    <div className="am-stars">★ ★ ★ ★ ★</div>
                    <span className="am-tool-link">去使用 →</span>
                  </div>
                </a>

                <a className="am-tool-card" data-tool-category="product" href="https://www.perplexity.ai/" target="_blank" rel="noopener noreferrer">
                  <div className="am-tool-top">
                    <div className="am-tool-logo">🔎</div>
                    <div>
                      <div className="am-tool-name">Perplexity</div>
                      <div className="am-tool-pill">效率工具</div>
                    </div>
                  </div>
                  <div className="am-tool-desc">AI搜索引擎</div>
                  <div className="am-tool-foot">
                    <div className="am-stars">★ ★ ★ ★ ★</div>
                    <span className="am-tool-link">去使用 →</span>
                  </div>
                </a>
              </div>

              <div className="am-tool-bottom" data-animate>
                <div className="am-muted">还有 190+ 个工具等你发现</div>
                <a className="am-btn am-btn-primary" href="/tools" rel="nofollow">
                  查看全部工具 →
                </a>
              </div>
            </div>
          </section>

          <section className="am-section am-section-lilac" id="courses">
            <div className="am-container">
              <div className="am-section-head" data-animate>
                <div className="am-kicker">AI课程</div>
                <h2 className="am-h2">不是让你"了解AI"，而是让你"用好AI"</h2>
                <p className="am-lead">每一节课都围绕实操设计，学完能立刻上手</p>
              </div>

              <div className="am-grid-2" data-animate>
                <article className="am-course-card">
                  <div className="am-course-cover am-course-cover-gradient">
                    <div className="am-course-play">
                      <i className="lucide lucide-play" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="am-course-body">
                    <div className="am-course-status am-status-free">免费</div>
                    <h3 className="am-course-title">超级个体：AI工具掌控与产品设计指南</h3>
                    <div className="am-course-meta">🕐 系统课程 · AI实战 · 适合职场人</div>
                    <p className="am-text">用 AI 把你从「执行者」变成「决策者」。系统化的 AI 实战课程，助你掌握 AI 工具，提升工作效率。</p>
                    <div className="am-course-learn">学完你能</div>
                    <ul className="am-list">
                      <li>建立真正能用上的 AI 底层认知</li>
                      <li>把 AI 用进写作、分析和日常工作流</li>
                      <li>从会用工具走向提升效率与决策质量</li>
                    </ul>
                    <a className="am-btn am-btn-primary am-btn-block" href="/knowledge" rel="nofollow">
                      立即学习 →
                    </a>
                  </div>
                </article>

                <article className="am-course-card">
                  <div className="am-course-cover am-course-cover-upcoming">
                    <div className="am-course-upcoming">
                      <i className="lucide lucide-clock" aria-hidden="true" />
                      即将上线
                    </div>
                  </div>
                  <div className="am-course-body">
                    <div className="am-course-status am-status-upcoming">即将上线</div>
                    <h3 className="am-course-title">用AI做副业：0基础月入过万实操</h3>
                    <div className="am-course-meta">🕐 共8节 · 视频课程 · 实战向</div>
                    <p className="am-text">从0搭建AI副业工作流，手把手带你实现持续变现</p>
                    <div className="am-course-learn">学完你能</div>
                    <ul className="am-list">
                      <li>搭建完整AI副业工作流</li>
                      <li>掌握多个可落地的变现方向</li>
                      <li>实现AI驱动的持续收入</li>
                    </ul>
                    <span className="am-btn am-btn-disabled am-btn-block" aria-disabled="true">
                      敬请期待
                    </span>
                  </div>
                </article>
              </div>
            </div>
          </section>

          <section className="am-section" id="projects">
            <div className="am-container">
              <div className="am-section-head" data-animate>
                <div className="am-kicker">我们的承诺</div>
                <h2 className="am-h2">为什么选择 AI创客？</h2>
                <p className="am-lead">我们不是工具目录，我们是你学习和使用AI路上的同行者</p>
              </div>

              <div className="am-feature-grid" data-animate>
                <article className="am-mini-card">
                  <div className="am-mini-icon">🎯</div>
                  <div>
                    <div className="am-mini-title">真实使用，不做推广</div>
                    <div className="am-mini-text">每个收录工具都经过亲测，不接受付费推广，只推真正好用的</div>
                  </div>
                </article>
                <article className="am-mini-card">
                  <div className="am-mini-icon">⚡</div>
                  <div>
                    <div className="am-mini-title">实用优先，结果导向</div>
                    <div className="am-mini-text">所有课程和内容围绕"能用上"设计，不讲虚的，只讲能立刻上手的</div>
                  </div>
                </article>
                <article className="am-mini-card">
                  <div className="am-mini-icon">🔄</div>
                  <div>
                    <div className="am-mini-title">持续更新，永不过时</div>
                    <div className="am-mini-text">AI工具日新月异，我们每天跟踪最新动态，确保内容始终保持最新</div>
                  </div>
                </article>
                <article className="am-mini-card">
                  <div className="am-mini-icon">🧩</div>
                  <div>
                    <div className="am-mini-title">工具+课程+项目，形成完整闭环</div>
                    <div className="am-mini-text">从发现工具，到系统学习，到真实落地，一个平台走完全程</div>
                  </div>
                </article>
                <article className="am-mini-card">
                  <div className="am-mini-icon">👥</div>
                  <div>
                    <div className="am-mini-title">创作者视角，非商业立场</div>
                    <div className="am-mini-text">我们站在使用者角度筛选内容，不受商业利益影响，只对用户负责</div>
                  </div>
                </article>
              </div>
            </div>
          </section>

          <section className="am-section am-section-gradient" id="stats">
            <div className="am-container">
              <div className="am-stats" data-animate>
                <div className="am-stat">
                  <div className="am-stat-num" data-count="1000+">
                    0
                  </div>
                  <div className="am-stat-label">收录AI工具</div>
                </div>
                <div className="am-stat-sep" aria-hidden="true" />
                <div className="am-stat">
                  <div className="am-stat-num" data-count="50+">
                    0
                  </div>
                  <div className="am-stat-label">课程内容节数</div>
                </div>
                <div className="am-stat-sep" aria-hidden="true" />
                <div className="am-stat">
                  <div className="am-stat-num" data-count="10000+">
                    0
                  </div>
                  <div className="am-stat-label">用户使用</div>
                </div>
                <div className="am-stat-sep" aria-hidden="true" />
                <div className="am-stat">
                  <div className="am-stat-num" data-count="1">
                    0
                  </div>
                  <div className="am-stat-label">持续更新</div>
                </div>
              </div>
            </div>
          </section>

        </main>
      </div>

      <style>{`
        :root {
          --am-bg: #ffffff;
          --am-muted: #f8f9fa;
          --am-lilac: #f5f3ff;
          --am-border: #e5e7eb;
          --am-title: #0f0f0f;
          --am-subtitle: #374151;
          --am-text: #6b7280;
          --am-weak: #9ca3af;
          --am-primary: #6366f1;
          --am-secondary: #3b82f6;
          --am-green: #10b981;
          --am-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
          --am-shadow-hover: 0 10px 28px rgba(0, 0, 0, 0.12);
          --am-radius: 16px;
          --am-ease: cubic-bezier(0.16, 1, 0.3, 1);
        }

        .am-page {
          font-family: Inter, "PingFang SC", "Microsoft YaHei", sans-serif;
          color: var(--am-title);
          background: var(--am-bg);
        }

        ::selection {
          background: #eef2ff;
          color: var(--am-primary);
        }

        html {
          scroll-behavior: smooth;
        }

        .am-container {
          width: min(1120px, calc(100% - 48px));
          margin: 0 auto;
        }

        .am-main {
          padding-top: 64px;
        }

        .am-hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding-top: 0;
        }

        .am-hero-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .am-hero-bg::before {
          content: "";
          position: absolute;
          top: -120px;
          right: -120px;
          width: 420px;
          height: 420px;
          border-radius: 999px;
          background: rgba(99, 102, 241, 0.15);
          filter: blur(80px);
        }

        .am-hero-inner {
          padding: 56px 0;
        }

        .am-hero-content {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .am-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 999px;
          background: #f0f0ff;
          color: var(--am-primary);
          font-size: 13px;
          font-weight: 600;
        }

        .am-pill-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: var(--am-green);
        }

        .am-h1 {
          margin: 18px 0 12px;
          font-size: 56px;
          font-weight: 800;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }

        .am-gradient-text {
          background: linear-gradient(135deg, var(--am-primary), var(--am-secondary));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .am-subtitle {
          margin: 0;
          max-width: 520px;
          font-size: 18px;
          font-weight: 400;
          line-height: 1.8;
          color: var(--am-text);
        }

        .am-hero-actions {
          display: flex;
          gap: 12px;
          margin-top: 22px;
        }

        .am-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 14px 28px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 15px;
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, border-color 0.2s ease;
          user-select: none;
        }

        .am-btn-primary {
          color: #ffffff;
          background: linear-gradient(135deg, var(--am-primary), var(--am-secondary));
          box-shadow: 0 10px 28px rgba(99, 102, 241, 0.22);
        }

        .am-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.35);
        }

        .am-btn-secondary {
          background: #ffffff;
          border: 1px solid rgba(99, 102, 241, 0.55);
          color: var(--am-primary);
          box-shadow: 0 2px 16px rgba(0, 0, 0, 0.04);
        }

        .am-btn-secondary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.08);
        }

        .am-btn-disabled {
          background: #f3f4f6;
          color: #9ca3af;
          border: 1px solid #e5e7eb;
        }

        .am-btn-block {
          width: 100%;
        }

        .am-hero-metrics {
          margin-top: 30px;
          display: flex;
          align-items: center;
          gap: 14px;
          color: var(--am-weak);
          font-size: 14px;
        }

        .am-metric-sep {
          width: 1px;
          height: 14px;
          background: #e5e7eb;
        }

        .am-hero-animate {
          opacity: 0;
          transform: translateY(20px);
          animation: amHeroIn 0.6s var(--am-ease) forwards;
        }

        @keyframes amHeroIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .am-section {
          padding: 100px 0;
        }

        .am-section-muted {
          background: var(--am-muted);
        }

        .am-section-lilac {
          background: var(--am-lilac);
        }

        .am-section-gradient {
          background: linear-gradient(135deg, var(--am-primary), var(--am-secondary));
          color: #ffffff;
          padding: 80px 0;
        }

        .am-section-head {
          text-align: center;
          margin-bottom: 48px;
        }

        .am-section-head-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 16px;
          text-align: left;
        }

        .am-kicker {
          display: inline-block;
          padding: 6px 10px;
          border-radius: 999px;
          background: #eef2ff;
          color: var(--am-primary);
          font-weight: 700;
          font-size: 13px;
          margin-bottom: 14px;
        }

        .am-h2 {
          margin: 0;
          font-size: 36px;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .am-h3 {
          margin: 14px 0 8px;
          font-size: 18px;
          font-weight: 700;
          color: var(--am-title);
        }

        .am-lead {
          margin: 10px auto 0;
          max-width: 640px;
          font-size: 15px;
          line-height: 1.8;
          color: var(--am-text);
        }

        .am-text {
          margin: 0;
          font-size: 15px;
          line-height: 1.8;
          color: var(--am-text);
        }

        .am-grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .am-grid-2 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
        }

        .am-card {
          position: relative;
          background: #ffffff;
          border: 1px solid var(--am-border);
          border-radius: var(--am-radius);
          padding: 22px 22px 18px;
          box-shadow: var(--am-shadow);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .am-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--am-shadow-hover);
        }

        .am-card-feature {
          border-top: 1px solid rgba(99, 102, 241, 0.22);
        }

        .am-card-topbar {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 4px;
          border-radius: var(--am-radius) var(--am-radius) 0 0;
          background: linear-gradient(135deg, var(--am-primary), var(--am-secondary));
        }

        .am-card-icon {
          width: 44px;
          height: 44px;
          border-radius: 999px;
          background: #eef2ff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--am-primary);
        }

        .am-badge-hot {
          position: absolute;
          top: 16px;
          right: 16px;
          padding: 6px 10px;
          border-radius: 999px;
          font-weight: 800;
          font-size: 12px;
          color: #ffffff;
          background: linear-gradient(135deg, var(--am-primary), var(--am-secondary));
          box-shadow: 0 10px 24px rgba(99, 102, 241, 0.25);
        }

        .am-badge-upcoming {
          position: absolute;
          top: 16px;
          right: 16px;
          padding: 6px 10px;
          border-radius: 999px;
          font-weight: 800;
          font-size: 12px;
          color: var(--am-green);
          background: #f0fdf4;
          border: 1px solid rgba(16, 185, 129, 0.25);
        }

        .am-list {
          margin: 14px 0;
          padding: 0;
          list-style: none;
          display: grid;
          gap: 8px;
          color: var(--am-subtitle);
          font-size: 14px;
          line-height: 1.7;
        }

        .am-list li {
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }

        .am-list .lucide {
          margin-top: 2px;
          color: var(--am-primary);
        }

        .am-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: var(--am-primary);
          font-weight: 700;
          font-size: 14px;
          margin-top: 6px;
        }

        .am-link:hover {
          text-decoration: underline;
        }

        .am-link-disabled {
          color: var(--am-weak);
          cursor: not-allowed;
        }

        .am-tags {
          margin-top: 12px;
          font-size: 12px;
          color: var(--am-weak);
          line-height: 1.6;
        }

        .am-tool-filter {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 18px;
        }

        .am-chip {
          border: 1px solid var(--am-border);
          border-radius: 999px;
          background: #ffffff;
          color: var(--am-subtitle);
          font-weight: 700;
          font-size: 13px;
          padding: 8px 12px;
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
        }

        .am-chip:hover {
          background: #f5f3ff;
        }

        .am-chip.is-active {
          background: linear-gradient(135deg, var(--am-primary), var(--am-secondary));
          color: #ffffff;
          border-color: transparent;
        }

        .am-tool-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }

        .am-tool-card {
          background: #ffffff;
          border: 1px solid var(--am-border);
          border-radius: 14px;
          padding: 14px;
          text-decoration: none;
          color: inherit;
          box-shadow: var(--am-shadow);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .am-tool-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--am-shadow-hover);
        }

        .am-tool-top {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .am-tool-logo {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(59, 130, 246, 0.12));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
        }

        .am-tool-name {
          font-weight: 700;
          font-size: 15px;
        }

        .am-tool-pill {
          display: inline-flex;
          margin-top: 6px;
          padding: 4px 10px;
          border-radius: 999px;
          background: #eef2ff;
          color: var(--am-primary);
          font-weight: 700;
          font-size: 12px;
        }

        .am-tool-desc {
          margin-top: 12px;
          font-size: 14px;
          color: var(--am-text);
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 44px;
        }

        .am-tool-foot {
          margin-top: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .am-stars {
          color: var(--am-primary);
          font-size: 12px;
          letter-spacing: 2px;
        }

        .am-tool-link {
          color: var(--am-subtitle);
          font-weight: 700;
          font-size: 13px;
        }

        .am-tool-bottom {
          padding-top: 26px;
          text-align: center;
          display: grid;
          gap: 14px;
          justify-items: center;
        }

        .am-muted {
          color: var(--am-weak);
          font-size: 14px;
        }

        .am-course-card {
          background: #ffffff;
          border: 1px solid var(--am-border);
          border-radius: var(--am-radius);
          overflow: hidden;
          box-shadow: var(--am-shadow);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .am-course-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--am-shadow-hover);
        }

        .am-course-cover {
          height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .am-course-cover-gradient {
          background: linear-gradient(135deg, var(--am-primary), var(--am-secondary));
        }

        .am-course-cover-upcoming {
          background: #f3f4f6;
        }

        .am-course-play {
          width: 56px;
          height: 56px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.92);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--am-primary);
        }

        .am-course-upcoming {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-weight: 800;
          color: #6b7280;
        }

        .am-course-body {
          padding: 18px 18px 20px;
        }

        .am-course-status {
          display: inline-flex;
          padding: 6px 10px;
          border-radius: 999px;
          font-weight: 800;
          font-size: 12px;
          margin-bottom: 12px;
        }

        .am-status-free {
          color: var(--am-green);
          background: #f0fdf4;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .am-status-upcoming {
          color: #f97316;
          background: #fff7ed;
          border: 1px solid rgba(249, 115, 22, 0.2);
        }

        .am-course-title {
          margin: 0;
          font-size: 20px;
          font-weight: 800;
        }

        .am-course-meta {
          margin-top: 10px;
          color: var(--am-weak);
          font-size: 13px;
        }

        .am-course-learn {
          margin-top: 12px;
          font-weight: 800;
          font-size: 13px;
          color: var(--am-subtitle);
        }

        .am-feature-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .am-mini-card {
          background: #ffffff;
          border: 1px solid var(--am-border);
          border-radius: 14px;
          padding: 16px;
          display: flex;
          gap: 12px;
          box-shadow: var(--am-shadow);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .am-mini-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--am-shadow-hover);
        }

        .am-mini-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8f9fa;
          font-size: 20px;
        }

        .am-mini-title {
          font-weight: 800;
          font-size: 14px;
          color: var(--am-title);
        }

        .am-mini-text {
          margin-top: 6px;
          color: var(--am-text);
          font-size: 14px;
          line-height: 1.7;
        }

        .am-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          align-items: center;
          gap: 10px;
        }

        .am-stat {
          text-align: center;
          padding: 8px 0;
        }

        .am-stat-num {
          font-size: 48px;
          font-weight: 800;
          font-family: Inter, "PingFang SC", "Microsoft YaHei", sans-serif;
          line-height: 1.1;
        }

        .am-stat-label {
          margin-top: 10px;
          font-size: 15px;
          opacity: 0.85;
        }

        .am-stat-sep {
          width: 1px;
          height: 54px;
          background: rgba(255, 255, 255, 0.35);
          justify-self: center;
        }

        .am-footer {
          background: #0f0f0f;
          color: #ffffff;
          padding: 60px 0 40px;
        }

        .am-footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 18px;
        }

        .am-footer-logo {
          font-weight: 900;
          font-size: 20px;
        }

        .am-footer-logo-cn {
          color: #ffffff;
        }

        .am-footer-title {
          font-weight: 800;
          margin-bottom: 12px;
          color: #ffffff;
        }

        .am-footer-text {
          color: #9ca3af;
          margin-top: 10px;
          font-size: 14px;
        }

        .am-footer-link {
          display: block;
          text-decoration: none;
          color: #9ca3af;
          font-size: 14px;
          margin-top: 10px;
          transition: color 0.2s ease;
        }

        .am-footer-link:hover {
          color: #ffffff;
        }

        .am-footer-link-disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .am-footer-sep {
          height: 1px;
          margin-top: 26px;
          background: rgba(255, 255, 255, 0.1);
        }

        .am-footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 18px;
        }

        .am-footer-copy {
          color: #6b7280;
          font-size: 14px;
        }

        [data-animate] {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s var(--am-ease), transform 0.6s var(--am-ease);
        }

        [data-animate].in-view {
          opacity: 1;
          transform: translateY(0);
        }

        @media (max-width: 1023px) {
          .am-tool-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .am-section-head-row {
            flex-direction: column;
            align-items: flex-start;
          }

          .am-feature-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .am-footer-grid {
            grid-template-columns: 1fr;
          }

          .am-footer-bottom {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
        }

        @media (max-width: 767px) {
          .am-container {
            width: min(1120px, calc(100% - 32px));
          }

          .am-h1 {
            font-size: 36px;
          }

          .am-section {
            padding: 60px 0;
          }

          .am-hero-actions {
            flex-direction: column;
            width: 100%;
            max-width: 360px;
          }

          .am-btn {
            width: 100%;
          }

          .am-hero-metrics {
            flex-direction: column;
            gap: 8px;
          }

          .am-metric-sep {
            display: none;
          }

          .am-grid-3 {
            grid-template-columns: 1fr;
          }

          .am-grid-2 {
            grid-template-columns: 1fr;
          }

          .am-tool-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .am-feature-grid {
            grid-template-columns: 1fr;
          }

          .am-stats {
            grid-template-columns: repeat(2, 1fr);
            gap: 22px 10px;
          }

          .am-stat-sep {
            display: none;
          }

          .am-stat-num {
            font-size: 36px;
          }
        }
      `}</style>
    </>
  );
}
