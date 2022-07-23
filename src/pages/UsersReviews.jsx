import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import * as reviewApi from '../services/reviews-api';
import * as userApi from '../services/users-api';

import ReviewItem from '../components/Reviews/ReviewItem';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import NoDataMessage from '../components/UI/NoDataMessage';
import classes from './UsersReviews.module.scss';

const UsersReviews = () => {
  const { uid } = useParams();
  const { token } = useSelector((state) => state.users);

  const {
    isLoading,
    isFetching,
    data: reviews,
  } = useQuery(
    ['OTHER_USERS_REVIEWS', uid],
    () => reviewApi.getReviewsByUserId({ uid, token }),
    { retry: false, initialData: [], enabled: !!uid }
  );

  const {
    isLoading: userLoading,
    isFetching: userFetching,
    data: user,
  } = useQuery(
    ['OTHER_USER', uid],
    () => userApi.getUserById({ id: uid, token }),
    { retry: false, initialData: null, enabled: !!uid }
  );

  if (isLoading || isFetching || userLoading || userFetching) {
    return <LoadingSpinner />;
  }
  //FIXME: error handling

  if (reviews.length === 0) {
    return <NoDataMessage>No reviews yet...</NoDataMessage>;
  }

  return (
    <div className={classes['users-reviews-container']}>
      {user && (
        <h2>
          <span className={classes.name}>{user.name}</span>'s{' '}
          <span className={classes.accent}>R</span>
          eviews
        </h2>
      )}
      {reviews.length !== 0 &&
        reviews.map((review) => (
          <ReviewItem key={review.review_id} review={review} />
        ))}
    </div>
  );
};

export default UsersReviews;
