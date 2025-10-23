import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

import {
  createListingDraft,
  publishListingDraft,
  updateListingDraft,
  uploadImage,
} from './PostFromDraftPage.duck';
import PostFromDraftPage from './PostFromDraftPage';

const mapStateToProps = state => {
  const {
    createListingDraftInProgress,
    createListingDraftError,
    publishListingInProgress,
    publishListingError,
    updateListingInProgress,
    updateListingError,
    uploadImageInProgress,
    uploadImageError,
  } = state.PostFromDraftPage;

  return {
    createListingDraftInProgress,
    createListingDraftError,
    publishListingInProgress,
    publishListingError,
    updateListingInProgress,
    updateListingError,
    uploadImageInProgress,
    uploadImageError,
  };
};

const mapDispatchToProps = dispatch => ({
  onCreateListing: params => dispatch(createListingDraft(params)),
  onPublishListing: params => dispatch(publishListingDraft(params)),
  onUpdateListing: params => dispatch(updateListingDraft(params)),
  onImageUpload: params => dispatch(uploadImage(params)),
});

const PostFromDraftPageContainer = compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(PostFromDraftPage);

export default PostFromDraftPageContainer;

