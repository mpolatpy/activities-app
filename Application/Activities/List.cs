using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<Result<List<ActivityDto>>> {

        }

        public class Handler : IRequestHandler<Query, Result<List<ActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<List<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                // eager loading
                // var activities = await _context.Activities
                //     .Include(activity => activity.Attendees) 
                //     .ThenInclude(u => u.AppUser)
                //     .ToListAsync();

                // var activitiesToReturn = _mapper.Map<List<ActivityDto>>(activities);

                // return Result<List<ActivityDto>>.Success(activitiesToReturn);

                // using ProjectTo provided by AutoMapper
                var activities = await _context.Activities
                    .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider)
                    .ToListAsync();
                
                return Result<List<ActivityDto>>.Success(activities);
            }
        }
    }
}