import React, { useState, useEffect } from 'react';
import { bool, func } from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { FormattedMessage, useIntl } from '../../util/reactIntl';
import { propTypes } from '../../util/types';
import { isScrollingDisabled } from '../../ducks/ui.duck';

import {
  LayoutSideNavigation,
  Page,
  PrimaryButton,
  SecondaryButton,
  IconCheckmark,
  IconSpinner,
  VerificationBadge,
} from '../../components';

import TopbarContainer from '../TopbarContainer/TopbarContainer';
import FooterContainer from '../FooterContainer/FooterContainer';

import { uploadVerificationDocuments, clearVerificationState } from './VerificationPage.duck';

import css from './VerificationPage.module.css';

const VerificationPageComponent = props => {
  const {
    scrollingDisabled,
    currentUser,
    uploadInProgress,
    uploadSuccess,
    uploadError,
    onUploadDocuments,
    onClearState,
  } = props;

  const intl = useIntl();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [documentType, setDocumentType] = useState('passport');
  const [showUploadForm, setShowUploadForm] = useState(false); // ✅ Показать форму вместо pending

  // ✅ Обрабатываем два формата isVerified: boolean или объект {isVerified: true}
  const publicData = currentUser?.attributes?.profile?.publicData;
  const isVerifiedValue = publicData?.isVerified;
  const isVerified = 
    isVerifiedValue === true || 
    (typeof isVerifiedValue === 'object' && isVerifiedValue?.isVerified === true);
  
  const verificationStatus =
    currentUser?.attributes?.profile?.protectedData?.verificationDocuments?.[0]?.status || null;

  useEffect(() => {
    return () => {
      // Cleanup: revoke preview URLs
      previews.forEach(preview => URL.revokeObjectURL(preview));
      onClearState();
    };
  }, []);

  const handleFileSelect = e => {
    const files = Array.from(e.target.files);

    // Limit to 5 documents
    if (selectedFiles.length + files.length > 5) {
      alert(intl.formatMessage({ id: 'VerificationPage.tooManyFiles' }));
      return;
    }

    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file));

    setSelectedFiles(prev => [...prev, ...files]);
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const handleRemoveFile = index => {
    // Revoke URL
    URL.revokeObjectURL(previews[index]);

    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (selectedFiles.length === 0) {
      alert(intl.formatMessage({ id: 'VerificationPage.noFilesSelected' }));
      return;
    }

    onUploadDocuments(selectedFiles, documentType);
  };

  const title = intl.formatMessage({ id: 'VerificationPage.title' });
  const schemaTitle = intl.formatMessage({ id: 'VerificationPage.schemaTitle' });

  // If already verified
  if (isVerified) {
    return (
      <Page title={title} scrollingDisabled={scrollingDisabled} schema={{ '@type': 'WebPage' }}>
        <LayoutSideNavigation
          topbar={<TopbarContainer />}
          footer={<FooterContainer />}
          useAccountSettingsNav
          accountSettingsNavProps={{ currentPage: 'VerificationPage' }}
        >
          <div className={css.content}>
            <h1 className={css.title}>
              <FormattedMessage id="VerificationPage.title" />
            </h1>
            <div className={css.verifiedContent}>
              <IconCheckmark className={css.successIcon} />
              <h2 className={css.successTitle}>
                <FormattedMessage id="VerificationPage.alreadyVerified" />
              </h2>
              <p className={css.successText}>
                <FormattedMessage id="VerificationPage.alreadyVerifiedDescription" />
              </p>
            </div>
          </div>
        </LayoutSideNavigation>
      </Page>
    );
  }

  // If documents are pending review (and user hasn't clicked "Upload different documents")
  if (verificationStatus === 'pending' && !uploadSuccess && !showUploadForm) {
    return (
      <Page title={title} scrollingDisabled={scrollingDisabled} schema={{ '@type': 'WebPage' }}>
        <LayoutSideNavigation
          topbar={<TopbarContainer />}
          footer={<FooterContainer />}
          useAccountSettingsNav
          accountSettingsNavProps={{ currentPage: 'VerificationPage' }}
        >
          <div className={css.content}>
            <h1 className={css.title}>
              <FormattedMessage id="VerificationPage.title" />
            </h1>
            <div className={css.pendingContent}>
              <IconSpinner className={css.pendingIcon} />
              <h2 className={css.pendingTitle}>
                <FormattedMessage id="VerificationPage.pendingReview" />
              </h2>
              <p className={css.pendingText}>
                <FormattedMessage id="VerificationPage.pendingReviewDescription" />
              </p>
              <SecondaryButton
                onClick={() => {
                  console.log('🔵 Reupload button clicked, showing upload form');
                  setShowUploadForm(true);
                  onClearState();
                }}
                className={css.reuploadButton}
              >
                <FormattedMessage id="VerificationPage.reuploadButton" />
              </SecondaryButton>
            </div>
          </div>
        </LayoutSideNavigation>
      </Page>
    );
  }

  // Upload form
  return (
    <Page title={title} scrollingDisabled={scrollingDisabled} schema={{ '@type': 'WebPage' }}>
      <LayoutSideNavigation
        topbar={<TopbarContainer />}
        footer={<FooterContainer />}
        useAccountSettingsNav
        accountSettingsNavProps={{ currentPage: 'VerificationPage' }}
      >
        <div className={css.content}>
          <h1 className={css.title}>
            <FormattedMessage id="VerificationPage.title" />
          </h1>
            <p className={css.description}>
              <FormattedMessage id="VerificationPage.description" />
            </p>

            <div className={css.badgeExample}>
              <span className={css.badgeExampleLabel}>
                <FormattedMessage id="VerificationPage.badgeExample" />
              </span>
              <VerificationBadge isVerified={true} />
            </div>

            <div className={css.formSection}>
              <label className={css.label}>
                <FormattedMessage id="VerificationPage.documentTypeLabel" />
              </label>
              <select
                className={css.select}
                value={documentType}
                onChange={e => setDocumentType(e.target.value)}
              >
                <option value="passport">
                  {intl.formatMessage({ id: 'VerificationPage.documentTypePassport' })}
                </option>
                <option value="id_card">
                  {intl.formatMessage({ id: 'VerificationPage.documentTypeIdCard' })}
                </option>
                <option value="driver_license">
                  {intl.formatMessage({ id: 'VerificationPage.documentTypeDriverLicense' })}
                </option>
                <option value="business_license">
                  {intl.formatMessage({ id: 'VerificationPage.documentTypeBusinessLicense' })}
                </option>
              </select>
            </div>

            <div className={css.formSection}>
              <label className={css.label}>
                <FormattedMessage id="VerificationPage.uploadLabel" />
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className={css.fileInput}
                id="verification-file-input"
              />
              <label htmlFor="verification-file-input" className={css.fileInputButton}>
                <FormattedMessage id="VerificationPage.selectFilesButton" />
              </label>
              <p className={css.hint}>
                <FormattedMessage id="VerificationPage.uploadHint" />
              </p>
            </div>

            {selectedFiles.length > 0 && (
              <div className={css.previewSection}>
                <h3 className={css.previewTitle}>
                  <FormattedMessage
                    id="VerificationPage.selectedFiles"
                    values={{ count: selectedFiles.length }}
                  />
                </h3>
                <div className={css.previewGrid}>
                  {selectedFiles.map((file, index) => (
                    <div key={index} className={css.previewItem}>
                      <img src={previews[index]} alt={file.name} className={css.previewImage} />
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className={css.removeButton}
                      >
                        ×
                      </button>
                      <p className={css.fileName}>{file.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {uploadError && (
              <div className={css.error}>
                <FormattedMessage id="VerificationPage.uploadError" />
              </div>
            )}

            {uploadSuccess && (
              <div className={css.success}>
                <IconCheckmark className={css.successIconSmall} />
                <FormattedMessage id="VerificationPage.uploadSuccess" />
              </div>
            )}

            <div className={css.buttonGroup}>
              <PrimaryButton
                onClick={handleSubmit}
                inProgress={uploadInProgress}
                disabled={selectedFiles.length === 0 || uploadInProgress}
              >
                <FormattedMessage id="VerificationPage.submitButton" />
              </PrimaryButton>
            </div>
        </div>
      </LayoutSideNavigation>
    </Page>
  );
};

VerificationPageComponent.defaultProps = {
  currentUser: null,
  uploadError: null,
};

VerificationPageComponent.propTypes = {
  scrollingDisabled: bool.isRequired,
  currentUser: propTypes.currentUser,
  uploadInProgress: bool.isRequired,
  uploadSuccess: bool.isRequired,
  uploadError: propTypes.error,
  onUploadDocuments: func.isRequired,
  onClearState: func.isRequired,
};

const mapStateToProps = state => {
  const { currentUser } = state.user;
  const { uploadInProgress, uploadSuccess, uploadError } = state.VerificationPage;

  return {
    scrollingDisabled: isScrollingDisabled(state),
    currentUser,
    uploadInProgress,
    uploadSuccess,
    uploadError,
  };
};

const mapDispatchToProps = dispatch => ({
  onUploadDocuments: (files, documentType) =>
    dispatch(uploadVerificationDocuments(files, documentType)),
  onClearState: () => dispatch(clearVerificationState()),
});

const VerificationPage = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(VerificationPageComponent);

export default VerificationPage;

