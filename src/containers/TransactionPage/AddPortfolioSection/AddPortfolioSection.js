import React, { useState } from 'react';
import { FormattedMessage, useIntl } from '../../../util/reactIntl';
import { PrimaryButton, SecondaryButton, ImageFromFile, IconClose } from '../../../components';

import css from './AddPortfolioSection.module.css';

const MAX_IMAGES = 6;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

const AddPortfolioSection = props => {
  const { onAddPortfolio, inProgress, transactionId, listingCategory } = props;
  const intl = useIntl();
  
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploadError, setUploadError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [portfolioAdded, setPortfolioAdded] = useState(false);

  const handleFileSelect = event => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        setUploadError(intl.formatMessage({ id: 'AddPortfolioSection.invalidFileType' }));
        return false;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        setUploadError(
          intl.formatMessage(
            { id: 'AddPortfolioSection.fileTooLarge' },
            { maxSize: '10MB' }
          )
        );
        return false;
      }
      return true;
    });

    if (selectedFiles.length + validFiles.length > MAX_IMAGES) {
      setUploadError(
        intl.formatMessage(
          { id: 'AddPortfolioSection.tooManyImages' },
          { maxImages: MAX_IMAGES }
        )
      );
      return;
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);
    setUploadError(null);
  };

  const handleRemoveFile = index => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) {
      setUploadError(intl.formatMessage({ id: 'AddPortfolioSection.noImages' }));
      return;
    }

    try {
      await onAddPortfolio({
        files: selectedFiles,
        title: title || intl.formatMessage({ id: 'AddPortfolioSection.defaultTitle' }),
        description,
        category: listingCategory,
        transactionId,
      });

      setPortfolioAdded(true);
      setShowForm(false);
      setSelectedFiles([]);
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Failed to add portfolio:', error);
      setUploadError(intl.formatMessage({ id: 'AddPortfolioSection.uploadFailed' }));
    }
  };

  if (portfolioAdded) {
    return (
      <div className={css.successMessage}>
        <span className={css.successIcon}>✓</span>
        <FormattedMessage id="AddPortfolioSection.successMessage" />
      </div>
    );
  }

  if (!showForm) {
    return (
      <div className={css.promptContainer}>
        <p className={css.promptText}>
          <FormattedMessage id="AddPortfolioSection.promptText" />
        </p>
        <SecondaryButton onClick={() => setShowForm(true)}>
          <FormattedMessage id="AddPortfolioSection.showFormButton" />
        </SecondaryButton>
      </div>
    );
  }

  return (
    <div className={css.root}>
      <h3 className={css.title}>
        <FormattedMessage id="AddPortfolioSection.title" />
      </h3>

      <div className={css.uploadArea}>
        <input
          type="file"
          id="portfolio-transaction-upload"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className={css.fileInput}
          disabled={selectedFiles.length >= MAX_IMAGES || inProgress}
        />
        <label htmlFor="portfolio-transaction-upload" className={css.uploadLabel}>
          {selectedFiles.length === 0 ? (
            <>
              <span className={css.uploadIcon}>📷</span>
              <FormattedMessage id="AddPortfolioSection.selectPhotos" />
              <span className={css.uploadHint}>
                <FormattedMessage
                  id="AddPortfolioSection.uploadHint"
                  values={{ max: MAX_IMAGES }}
                />
              </span>
            </>
          ) : (
            <FormattedMessage
              id="AddPortfolioSection.addMoreImages"
              values={{ current: selectedFiles.length, max: MAX_IMAGES }}
            />
          )}
        </label>
      </div>

      {selectedFiles.length > 0 && (
        <div className={css.previewGrid}>
          {selectedFiles.map((file, index) => (
            <div key={index} className={css.previewItem}>
              <ImageFromFile
                file={file}
                className={css.previewImage}
                aspectWidth={1}
                aspectHeight={1}
              >
                <button
                  type="button"
                  className={css.removeButton}
                  onClick={() => handleRemoveFile(index)}
                >
                  <IconClose rootClassName={css.removeIcon} />
                </button>
              </ImageFromFile>
            </div>
          ))}
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className={css.formFields}>
          <div className={css.formField}>
            <label className={css.label}>
              <FormattedMessage id="AddPortfolioSection.titleLabel" />
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={intl.formatMessage({ id: 'AddPortfolioSection.titlePlaceholder' })}
              className={css.input}
              maxLength={100}
            />
          </div>

          <div className={css.formField}>
            <label className={css.label}>
              <FormattedMessage id="AddPortfolioSection.descriptionLabel" />
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder={intl.formatMessage({ id: 'AddPortfolioSection.descriptionPlaceholder' })}
              className={css.textarea}
              maxLength={500}
              rows={3}
            />
          </div>

          <div className={css.actions}>
            <SecondaryButton
              type="button"
              onClick={() => {
                setShowForm(false);
                setSelectedFiles([]);
                setTitle('');
                setDescription('');
              }}
              disabled={inProgress}
            >
              <FormattedMessage id="AddPortfolioSection.cancel" />
            </SecondaryButton>
            <PrimaryButton type="button" onClick={handleSubmit} inProgress={inProgress}>
              <FormattedMessage id="AddPortfolioSection.submit" />
            </PrimaryButton>
          </div>
        </div>
      )}

      {uploadError && <div className={css.error}>{uploadError}</div>}
    </div>
  );
};

export default AddPortfolioSection;

