import { MODULE_CARDS } from '../constants/fireDesignOptions';

function ModuleCards({ selectedDiscipline, onSelectDiscipline }) {
  return (
    <section className="module-strip" aria-label="Design module selection">
      {MODULE_CARDS.map((card) => {
        const isActive = selectedDiscipline === card.key;

        return (
          <button
            key={card.key}
            type="button"
            className={`module-card ${isActive ? 'active' : ''}`}
            onClick={() => onSelectDiscipline(card.key)}
            aria-pressed={isActive}
            title={card.text}
          >
            <span>{card.badge}</span>
            <strong>{card.title}</strong>
            <small>{card.text}</small>
          </button>
        );
      })}
    </section>
  );
}

export default ModuleCards;