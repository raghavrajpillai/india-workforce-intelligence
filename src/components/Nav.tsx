import { NavLink, useNavigate } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/explore', label: 'Explore Data' },
  { to: '/methodology', label: 'Methodology' },
  { to: '/about', label: 'About' },
];

export default function Nav() {
  const navigate = useNavigate();
  return (
    <nav className="site-nav">
      <div className="nav-inner">
        <div className="nav-brand" onClick={() => navigate('/')}>
          <span className="nav-dot" />
          <span className="nav-brand-text">India AI Workforce Intelligence</span>
        </div>
        <div className="nav-links">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => `nav-link${isActive ? ' nav-link-active' : ''}`}
            >
              {l.label}
            </NavLink>
          ))}
        </div>
        <button className="nav-cta" onClick={() => navigate('/explore')}>
          Explore Tool &rarr;
        </button>
      </div>
    </nav>
  );
}
