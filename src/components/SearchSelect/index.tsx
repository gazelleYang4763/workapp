import { useState, useRef, useEffect } from 'react';
import { Input, Tag, Space, Empty, Spin } from 'antd';
import { SearchOutlined, PlusOutlined, CloseCircleFilled } from '@ant-design/icons';
import { useThemeStore } from '@/store/theme';

export interface SearchSelectOption {
  label: string;
  value: string;
}

export interface SearchSelectProps {
  options: SearchSelectOption[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  mode?: 'single' | 'multiple';
  placeholder?: string;
  allowAdd?: boolean;
  onAdd?: (label: string) => void;
  style?: React.CSSProperties;
  disabled?: boolean;
}

const SearchSelect: React.FC<SearchSelectProps> = ({
  options,
  value,
  onChange,
  mode = 'single',
  placeholder = '搜索...',
  allowAdd = true,
  onAdd,
  style,
  disabled = false,
}) => {
  const { theme } = useThemeStore();
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const inputRef = useRef<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchText.toLowerCase())
  );

  const selectedValues = mode === 'multiple'
    ? (Array.isArray(value) ? value : [])
    : (value ? [value] : []);

  const handleSelect = (optionValue: string) => {
    if (mode === 'multiple') {
      const newValue = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue];
      onChange?.(newValue);
    } else {
      onChange?.(optionValue);
      setOpen(false);
      setSearchText('');
    }
  };

  const handleRemove = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (mode === 'multiple') {
      onChange?.(selectedValues.filter((v) => v !== optionValue));
    } else {
      onChange?.('');
    }
  };

  const handleAddNew = () => {
    if (searchText.trim()) {
      onAdd?.(searchText.trim());
      setSearchText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((prev) => Math.min(prev + 1, filteredOptions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightIndex >= 0 && filteredOptions[highlightIndex]) {
        handleSelect(filteredOptions[highlightIndex].value);
      } else if (allowAdd && searchText.trim()) {
        handleAddNew();
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
      setSearchText('');
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as HTMLElement)) {
        setOpen(false);
        setSearchText('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getSelectedLabels = () => {
    return selectedValues.map((v) => {
      const opt = options.find((o) => o.value === v);
      return opt ? opt.label : v;
    });
  };

  const showAddOption = allowAdd && searchText.trim() &&
    !filteredOptions.some((o) => o.label.toLowerCase() === searchText.toLowerCase());

  return (
    <div ref={dropdownRef} style={{ position: 'relative', ...style }}>
      <div
        onClick={() => !disabled && setOpen(true)}
        style={{
          border: `1px solid ${open ? theme.colors.primary : theme.colors.border}`,
          borderRadius: 6,
          padding: '4px 8px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          background: theme.colors.bgContainer,
          minHeight: 32,
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 4,
          opacity: disabled ? 0.5 : 1,
        }}
      >
        {mode === 'multiple' ? (
          selectedValues.map((v) => (
            <Tag
              key={v}
              closable
              onClose={(e) => handleRemove(v, e)}
              style={{ margin: 0 }}
            >
              {options.find((o) => o.value === v)?.label || v}
            </Tag>
          ))
        ) : selectedValues.length > 0 ? (
          <span style={{ color: theme.colors.textPrimary }}>
            {options.find((o) => o.value === selectedValues[0])?.label || selectedValues[0]}
          </span>
        ) : (
          <span style={{ color: theme.colors.textTertiary }}>{placeholder}</span>
        )}
        <Input
          ref={inputRef}
          value={searchText}
          onChange={(e) => { setSearchText(e.target.value); setHighlightIndex(-1); }}
          onKeyDown={handleKeyDown}
          onFocus={() => setOpen(true)}
          style={{
            border: 'none',
            outline: 'none',
            boxShadow: 'none',
            padding: 0,
            flex: 1,
            minWidth: 60,
            background: 'transparent',
          }}
          disabled={disabled}
          placeholder={selectedValues.length > 0 ? '' : placeholder}
        />
      </div>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: 4,
            background: theme.colors.bgContainer,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: 6,
            boxShadow: theme.colors.shadowCard,
            zIndex: 1000,
            maxHeight: 240,
            overflow: 'auto',
          }}
        >
          {filteredOptions.length === 0 && !showAddOption ? (
            <Empty description="无匹配选项" style={{ padding: 16 }} />
          ) : (
            <>
              {filteredOptions.map((opt, index) => (
                <div
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    background: highlightIndex === index
                      ? theme.colors.bgLayout
                      : selectedValues.includes(opt.value)
                        ? theme.colors.primary + '10'
                        : 'transparent',
                    borderBottom: `1px solid ${theme.colors.border}`,
                  }}
                  onMouseEnter={() => setHighlightIndex(index)}
                >
                  <Space>
                    {selectedValues.includes(opt.value) && (
                      <span style={{ color: theme.colors.primary }}>✓</span>
                    )}
                    {opt.label}
                  </Space>
                </div>
              ))}
              {showAddOption && (
                <div
                  onClick={handleAddNew}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    color: theme.colors.primary,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <PlusOutlined /> 添加 "{searchText}"
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchSelect;
