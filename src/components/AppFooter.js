import React, { useEffect, useState } from 'react';
import { CFooter } from '@coreui/react';
import { loadConfig, getConfig } from '../config';

const AppFooter = () => {
  const [config, setConfig] = useState(null);

  useEffect(() => {
      async function fetchConfig() {
          const configData = await loadConfig();
          setConfig(configData);
      }
      fetchConfig();
  }, []);

  if (!config) {
      return null; // Hoặc một loader nếu cần
  }

  return (
    <CFooter className="px-4">
      <div>
        <a href="#" target="_blank" rel="noopener noreferrer">
          {config.TITLE1}
        </a>
        <span className="ms-1">&copy; {config.TITLE2}</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="#" target="_blank" rel="noopener noreferrer">
          {config.TITLE3}
        </a>
      </div>
    </CFooter>
  );
}

export default React.memo(AppFooter);
